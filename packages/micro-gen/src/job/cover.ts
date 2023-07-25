import puppeteer from "puppeteer";
import { eq } from "drizzle-orm";
import type { Job, DoneCallback } from "bull";
import { db, project as projectTable } from "@nonovel/db";
import { postProcessImage, promptCover } from "@nonovel/lib";
import { compileCoverFromTemplate } from "../template/cover";

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

    const coverBackgroundBase64 = await promptCover({
      title: project.name,
      author: project.penName,
    });

    log = `${jobId}: generated background cover for project with id: ${projectId}`;
    console.log(log);
    await job.log(log);

    await job.progress(50);

    const compiledCoverHtml = compileCoverFromTemplate({
      title: project.name,
      author: project.penName,
      background: coverBackgroundBase64,
    });

    const puppeteerBrowser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
      devtools: false,
      headless: "new",
      dumpio: false,
    });
    const puppeteerPage = await puppeteerBrowser.newPage();

    await puppeteerPage.setViewport({
      width: 600,
      height: 900,
    });

    await puppeteerPage.setContent(compiledCoverHtml);

    const rawImageBuffer = await puppeteerPage.screenshot({
      encoding: "binary",
    });

    await puppeteerBrowser.close();

    await job.progress(80);

    const processedImageBase64 = await postProcessImage(rawImageBuffer);

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
