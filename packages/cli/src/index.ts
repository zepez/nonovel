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
  NewChapter,
  chapter as chapterTable,
} from "@nonovel/db";
import { truncate } from "./lib/log";

const program = new Command();

program.name("nn").description("NoNovel internal CLI").version("1.0.0");

program
  .command("epub")
  .description("Parse an epub file and push it to a database")
  .argument("<path>", "absolute path to epub file")
  .action(async (file: string) => {
    if (!file) throw new Error("No file path provided");

    const epub = new Epub(file);
    console.log("Parsing epub file...");
    await epub.read();

    console.log("Epub file parsed successfully!");

    // #####################################

    const project: NewProject = {
      id: uuidv4(),
      cover: epub.opfMetadata.cover,
      name: await input({
        message: "Project name",
        default: epub.opfMetadata.title,
      }),
      slug: await input({
        message: "Project slug",
        default: slugify(epub.opfMetadata.title).toLowerCase(),
      }),
      description: await input({
        message: "Project description",
        default: `${epub.opfMetadata.title} by ${epub.opfMetadata.creator}`,
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
        return { name: `${c.name} ${c.html.length} chars`, value: c };
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

    // #####################################

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
        order: parseFloat(
          await input({
            message: "Chapter order",
            default: idx.toString(),
          })
        ),
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

      console.log("Inserting chapters into database...");
      await tx.insert(chapterTable).values(chapters);
    });
  });

program.parse(process.argv);
