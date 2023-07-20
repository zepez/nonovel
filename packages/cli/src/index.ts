import { Command } from "commander";
import { input } from "@inquirer/prompts";
import checkbox from "@inquirer/checkbox";
import select from "@inquirer/select";
import confirm from "@inquirer/confirm";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

import { Epub } from "@nonovel/epub";
import {
  db,
  NewProject,
  project as projectTable,
  projectGenre as projectGenreTable,
  NewChapter,
  chapter as chapterTable,
} from "@nonovel/db";
import { truncate } from "./lib/log";
import { selectGenres, generateSynopsis } from "./lib/prompt";
import { processImageBuffer, generateCoverImage } from "./lib/image";

const program = new Command();

program.name("nn").description("NoNovel internal CLI").version("1.0.0");

program
  .command("epub")
  .description("Parse an epub file and push it to a database")
  .argument("<path>", "absolute path to epub file")
  .action(async (file: string) => {
    if (!file) throw new Error("No file path provided");

    console.log("Parsing epub file...");
    const epub = new Epub(file);
    await epub.read();

    console.log("Epub file parsed successfully!");

    // #####################################

    const projectDescription = await generateSynopsis({
      title: epub.opfMetadata.title,
      author: epub.opfMetadata.creator,
    });

    // #####################################

    const generateNewCover = await select({
      message: "Generate a new cover?",
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

    const cover = generateNewCover
      ? await processImageBuffer(
          await generateCoverImage({
            title: epub.opfMetadata.title,
            author: epub.opfMetadata.creator,
          })
        )
      : await processImageBuffer(epub.opfMetadata.cover);

    // #####################################

    const project: NewProject = {
      id: uuidv4(),
      cover,
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
      description: await input({
        message: "Project description",
        default: projectDescription,
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

    console.log("Project:", truncate(project, 100));

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
    const aiSelectedGenreNamesString = await selectGenres({
      genres: availableGenreNames,
      title: epub.opfMetadata.title,
      author: epub.opfMetadata.creator,
    });
    console.log("AI Generated genres:", aiSelectedGenreNamesString);

    const aiSelectedGenreNames = aiSelectedGenreNamesString
      .split(",")
      .map((s) => s.trim());

    const aiSelectedGenres = availableGenres.filter((g) =>
      aiSelectedGenreNames.includes(g.name)
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

    const contentType: "html" | "md" = await select({
      message: "Chapter content type",
      choices: [
        {
          name: "HTML",
          value: "html",
        },
        {
          name: "Markdown",
          value: "md",
        },
      ],
    });

    const chapters: NewChapter[] = [];
    for (const chapter of selectedChapters) {
      const idx = selectedChapters.indexOf(chapter) + 1;
      chapters.push({
        id: uuidv4(),
        projectId: project.id as string,
        name: await input({
          message: "Chapter name",
          default: chapter.name.replace(
            /^Chapter \d+\s*-\s*|^Chapter \d+\s*:\s*/,
            ""
          ),
        }),
        order: parseFloat(idx.toString()),
        content: chapter.html,
        contentType,
      });
    }

    chapters.forEach((c) => console.log(truncate(c, 100)));

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
  });

program.parse(process.argv);
