import { input } from "@inquirer/prompts";
import checkbox from "@inquirer/checkbox";
import select from "@inquirer/select";
import confirm from "@inquirer/confirm";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

import {
  db,
  NewProject,
  project as projectTable,
  projectGenre as projectGenreTable,
  NewChapter,
  chapter as chapterTable,
} from "@nonovel/db";
import { coverGenerationQueue } from "@nonovel/kv";
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
      default: slugify(epub.opfMetadata.title).toLowerCase(),
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

  const generateNewCover = await select({
    message:
      "Use AI to generate a new cover? If not, the existing cover will be used.",
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

  if (!generateNewCover && epub.opfMetadata.cover) {
    const coverBuffer = await postProcessImage(epub.opfMetadata.cover);
    const cover = await upload({
      buffer: coverBuffer,
      group: project.slug,
      category: "cover",
      extOrFileName: "webp",
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

  const synopsis = generateNewSynopsis
    ? await input({
        message: "AI generated synopsis",
        default:
          (await chainProjectSynopsis({
            title: epub.opfMetadata.title,
            author: epub.opfMetadata.creator,
          })) || "",
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

  const availableGenres = await db.query.genre.findMany();
  const availableGenreNames = availableGenres.map((g) => g.name);

  console.log("AI Generating genres...");
  const aiSelectedGenreNames = await chainProjectGenre({
    title: epub.opfMetadata.title,
    author: epub.opfMetadata.creator,
    genres: availableGenreNames,
  });
  console.log("AI Generated genres:", aiSelectedGenreNames.join(", "));

  const aiSelectedGenres = availableGenres.filter((g) =>
    aiSelectedGenreNames.includes(g.name.toLowerCase())
  );

  const deselectedGenres = await checkbox({
    message:
      "These genres were selected by the AI. Please select which chapters to EXCLUDE.",
    choices: aiSelectedGenres.map((g) => {
      return {
        name: g.name,
        value: g,
      };
    }),
  });

  const selectedGenres = aiSelectedGenres.filter(
    (g) => !deselectedGenres.includes(g)
  );

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
    chapters.push({
      id: uuidv4(),
      projectId: project.id as string,
      name: chapter.name.replace(/^Chapter \d+\s*-\s*|^Chapter \d+\s*:\s*/, ""),
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

  await db.transaction(async (tx) => {
    console.log("Inserting project into database...");
    await tx.insert(projectTable).values(project);

    console.log("Relating genres to project in database...");
    await tx.insert(projectGenreTable).values(genres);

    console.log("Inserting chapters into database...");
    await tx.insert(chapterTable).values(chapters);
  });

  if (generateNewCover) {
    console.log("Adding cover generation to queue...");
    await coverGenerationQueue.add({
      projectId: project.id as string,
    });
  }

  // #####################################

  process.exit(0);
};
