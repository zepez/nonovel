import puppeteer from "puppeteer";
import { eq } from "drizzle-orm";
import type { Job, DoneCallback } from "bull";
import { db, project as projectTable } from "@nonovel/db";
import { postProcessImage, promptCover } from "@nonovel/lib";
import { upload } from "@nonovel/blob";
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

    log = `${jobId}: starting cover generation job for project ${projectId}`;
    console.log(log);
    await job.log(log);

    const project = await db.query.project.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project) {
      log = `${jobId}: project not found in database`;
      console.log(log);
      return done(new Error(log));
    }

    if (!project.penName) {
      log = `${jobId}: project does not have a penName`;
      console.log(log);
      return done(new Error(log));
    }

    log = `${jobId}: project found in database`;
    console.log(log);
    await job.log(log);

    await job.progress(20);

    const coverBackgroundBase64 = await promptCover({
      title: project.name,
      author: project.penName,
    });

    log = `${jobId}: AI generated background cover`;
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

    const postProcessedImage = await postProcessImage(rawImageBuffer);
    const path = await upload({
      buffer: postProcessedImage,
      group: project.slug,
      category: "cover",
      extOrFileName: "webp",
    });

    log = `${jobId}: uploaded cover to storage bucket`;
    console.log(log);
    await job.log(log);

    await db
      .update(projectTable)
      .set({
        cover: path,
      })
      .where(eq(projectTable.id, projectId));

    await job.progress(100);

    log = `${jobId}: updated project with cover in database`;
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
