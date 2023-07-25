import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { eq } from "drizzle-orm";
import Handlebars from "handlebars";
import type { Job, DoneCallback } from "bull";
import { db, project as projectTable } from "@nonovel/db";
import { promptImage } from "../prompt";
import { postprocessImage } from "../postprocess";

export const generateCoverJob = async (
  job: Job<{
    projectId: string;
  }>,
  done: DoneCallback
) => {
  const { id: jobId } = job;
  let log = "";

  try {
    const { projectId } = job.data;

    const project = await db.query.project.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    log = `${jobId}: project found with id: ${projectId}`;
    console.log(log);
    await job.log(log);

    if (!project)
      return done(new Error(`project not found with id: ${projectId}`));

    if (!project.penName)
      return done(
        new Error(`project does not have a penName with id: ${projectId}`)
      );

    await job.progress(20);

    const coverBackgroundBase64 = await promptImage([
      {
        text: `beautiful book illustration, ${project.name}, ${project.penName}`,
        weight: 1,
      },
    ]);

    log = `${jobId}: generated background cover for project with id: ${projectId}`;
    console.log(log);
    await job.log(log);

    await job.progress(50);

    const coverTemplatePath = path.join(
      __dirname,
      "..",
      "template",
      "cover.hbs"
    );
    const coverTemplateFile = fs.readFileSync(coverTemplatePath, "utf-8");
    const coverTemplate = Handlebars.compile(coverTemplateFile);

    const coverCompiled = coverTemplate({
      title: project.name,
      author: project.penName,
      background: coverBackgroundBase64,
    });

    const puppeteerBrowser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
      devtools: false,
      headless: true,
      dumpio: true,
    });
    const puppeteerPage = await puppeteerBrowser.newPage();

    await puppeteerPage.setViewport({
      width: 600,
      height: 900,
    });

    await puppeteerPage.setContent(coverCompiled);

    const rawImageBuffer = await puppeteerPage.screenshot({
      encoding: "binary",
    });

    await puppeteerBrowser.close();

    await job.progress(80);

    const processedImageBase64 = await postprocessImage(rawImageBuffer);

    await db
      .update(projectTable)
      .set({
        cover: processedImageBase64,
      })
      .where(eq(projectTable.id, projectId));

    await job.progress(100);

    log = `${jobId}: updated project with cover, ${projectId}`;
    console.log(log);
    await job.log(log);

    return done();
  } catch (error) {
    if (error instanceof Error) {
      log = `${jobId}: ${error.message ?? "error"}`;
      console.error(error);
      return done(error);
    }
  }
};
