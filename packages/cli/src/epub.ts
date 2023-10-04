import { input } from "@inquirer/prompts";
import checkbox from "@inquirer/checkbox";
import select from "@inquirer/select";
import confirm from "@inquirer/confirm";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

import config from "@nonovel/config-server";
import {
  db,
  NewProject,
  project as projectTable,
  projectGenre as projectGenreTable,
  NewChapter,
  chapter as chapterTable,
} from "@nonovel/db";
import { upload } from "@nonovel/blob";
import { Epub } from "@nonovel/epub";
import { chainProjectGenre, chainProjectSynopsis } from "@nonovel/ai";
import { postProcessImage, truncateLog } from "@nonovel/lib";

export const epubCommand = async (file: string | undefined) => {
  if (!file) throw new Error("No file path provided");

  console.log("Parsing epub file...");
  const epub = new Epub(file);
  await epub.read();

  console.log("Epub file parsed successfully!");

  // #####################################

  const project: NewProject = {
    id: uuidv4(),
    cover: null,
    description: null,
    name: await input({
      message: "Project name",
      default: epub.opfMetadata.title,
    }),
    slug: await input({
      message: "Project slug",
      default: slugify(epub.opfMetadata.title, {
        lower: true,
        strict: true,
        trim: true,
        locale: "en",
        remove: /[*+~.()'"!:@]/g,
      }),
    }),
    penName: await input({
      message: "Pen name",
      default: epub.opfMetadata.creator,
    }),
    progress: await select({
      message: "Project progress",
      choices: [
        {
          name: "Finished",
          value: "finished",
        },
        {
          name: "Ongoing",
          value: "ongoing",
        },
      ],
    }),
  };

  // #####################################

  const useExistingCover = epub.opfMetadata.cover
    ? await select({
        message: "A cover was found in the epub file. Do you want to use it?",
        choices: [
          {
            name: "No",
            value: false,
          },
          {
            name: "Yes",
            value: true,
          },
        ],
      })
    : false;

  if (useExistingCover && epub.opfMetadata.cover) {
    const coverBuffer = await postProcessImage(epub.opfMetadata.cover);
    const cover = await upload({
      buffer: coverBuffer,
      group: project.slug,
      category: "cover",
      extOrFileName: "jpeg",
    });

    Object.assign(project, { cover });
  }

  // #####################################

  const generateNewSynopsis = await select({
    message:
      "Use AI to create a synopsis? If not, you will be asked to provide one.",
    choices: [
      {
        name: "Yes",
        value: true,
      },
      {
        name: "No",
        value: false,
      },
    ],
  });

  if (generateNewSynopsis) console.log("Generating synopsis...");
  const generatedSynopsis = generateNewSynopsis
    ? await chainProjectSynopsis({
        title: epub.opfMetadata.title,
        author: epub.opfMetadata.creator,
      })
    : null;

  const synopsis = generatedSynopsis
    ? await input({
        message: "AI generated synopsis",
        default: generatedSynopsis,
      })
    : await input({
        message: "Custom synopsis",
      });

  Object.assign(project, { description: synopsis });

  // #####################################

  const deselectedChapters = await checkbox({
    message: "Select which chapters to EXCLUDE from the project",
    choices: epub.cleanedTocItemContent.map((c) => {
      return {
        name: `${c.name.substring(0, 50)} ${c.html.length} chars`,
        value: c,
      };
    }),
  });

  const selectedChapters = epub.cleanedTocItemContent.filter(
    (c) => !deselectedChapters.includes(c)
  );

  console.log(
    "Chapters to include:",
    selectedChapters.map((c) => c.name)
  );

  // #####################################

  // 1. get all available genres from database
  const availableGenres = await db.query.genre.findMany();
  // 2. we only need the genre names right now
  const availableGenreNames = availableGenres.map((g) => g.name);

  // 3. ask ai which genre names apply to the text
  console.log("AI Generating genres...");
  const aiSelectedGenreNames = await chainProjectGenre({
    title: epub.opfMetadata.title,
    author: epub.opfMetadata.creator,
    genres: availableGenreNames,
  });
  console.log("AI Generated genres:", aiSelectedGenreNames.join(", "));

  // 4. get the full genre object for each of the returned genre names
  const aiSelectedGenres = availableGenres.filter((g) =>
    aiSelectedGenreNames.includes(g.name.toLowerCase())
  );

  // 5. ask user if they want to deselect any of the ai selected genres
  const aiDeselectedGenres =
    aiSelectedGenres.length > 0
      ? await checkbox({
          message:
            "These genres were selected by the AI. Please select which chapters to EXCLUDE.",
          choices: aiSelectedGenres.map((g) => {
            return {
              name: g.name,
              value: g,
            };
          }),
        })
      : [];

  // 6. ask user if they want to select any more genres
  const userSelectedGenres = await checkbox({
    message: "Additional genres",
    choices: availableGenres
      .filter((g) => !aiSelectedGenres.includes(g))
      .map((g) => {
        return {
          name: g.name,
          value: g,
        };
      }),
  });

  // 7. combine the ai selected genres with the user selected genres
  const selectedGenres = [
    ...aiSelectedGenres.filter((g) => !aiDeselectedGenres.includes(g)),
    ...userSelectedGenres,
  ];

  // 8. format genres for database insertion
  const genres = selectedGenres.map((g) => {
    return {
      projectId: project.id as string,
      genreId: g.id,
    };
  });

  // #####################################

  const chapters: NewChapter[] = [];
  for (const chapter of selectedChapters) {
    const idx = selectedChapters.indexOf(chapter) + 1;
    const name = chapter.name.replace(
      /^Chapter \d+\s*-\s*|^Chapter \d+\s*:\s*/,
      ""
    );

    const slug = slugify(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    chapters.push({
      id: uuidv4(),
      projectId: project.id as string,
      name,
      slug,
      order: parseFloat(idx.toString()),
      content: chapter.html,
      contentType: "html",
    });
  }

  chapters.forEach((c) => console.log(truncateLog(c, 100)));

  const answer = await confirm({ message: "Continue to database insert" });

  if (!answer) {
    console.log("Aborting...");
    process.exit(0);
  }

  // #####################################

  console.log("Inserting project into database...");
  await db.insert(projectTable).values(project);

  console.log("Relating genres to project in database...");
  await db.insert(projectGenreTable).values(genres);

  console.log("Inserting chapters into database...");
  await db.insert(chapterTable).values(chapters);

  try {
    if (!useExistingCover && project.id) {
      console.log("Generating cover image...");
      const coverReqBody = JSON.stringify({ id: project.id });
      const res = await fetch(`${config.WEB_URL}/api/gen/cover/screenshot`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": coverReqBody.length.toString(),
          Authorization: `Bearer ${config.NB_GEN_SECRET_KEY}`,
        }),
        body: coverReqBody,
      });

      if (!res.ok) {
        const resBody = await res.json();
        throw new Error("ERROR: Failed to generate cover.", resBody);
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error("ERROR: Failed to generate cover.", e.message);
    }
  }

  // #####################################

  process.exit(0);
};
