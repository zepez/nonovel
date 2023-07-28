import puppeteer from "puppeteer";
import { eq } from "drizzle-orm";
import type { Job, DoneCallback } from "bull";
import { db, project as projectTable } from "@nonovel/db";
import { postProcessImage } from "@nonovel/lib";
import { chainProjectCover } from "@nonovel/ai";
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

    log = `${jobId}: starting cover generation`;
    console.log(log);
    await job.log(log);

    const project = await db.query.project.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project) {
      log = `${jobId}: project not found`;
      console.log(log);
      return done(new Error(log));
    }

    if (!project.penName) {
      log = `${jobId}: project does not have a penName`;
      console.log(log);
      return done(new Error(log));
    }

    log = `${jobId}: project found`;
    console.log(log);
    await job.log(log);

    await job.progress(20);

    const coverBackgroundBase64 = await chainProjectCover({
      title: project.name,
      author: project.penName,
    });

    if (!coverBackgroundBase64) {
      log = `${jobId}: AI failed to generate background`;
      console.log(log);
      return done(new Error(log));
    }

    log = `${jobId}: AI generated background`;
    console.log(log);
    await job.log(log);

    await job.progress(50);

    const compiledCoverHtml = compileCoverFromTemplate({
      title: project.name.toUpperCase(),
      author: project.penName,
      background: coverBackgroundBase64,
    });

    const puppeteerBrowser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
      dumpio: false,
      devtools: false,
      headless: "new",
      // headless: false,
      // devtools: true,
      // slowMo: 500,
    });
    const puppeteerPage = await puppeteerBrowser.newPage();

    await puppeteerPage.setViewport({
      width: 600,
      height: 900,
    });

    await puppeteerPage.setContent(compiledCoverHtml, {
      waitUntil: "networkidle0",
    });

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
      extOrFileName: "jpeg",
    });

    log = `${jobId}: uploaded cover to bucket`;
    console.log(log);
    await job.log(log);

    await db
      .update(projectTable)
      .set({
        cover: path,
      })
      .where(eq(projectTable.id, projectId));

    await job.progress(100);

    log = `${jobId}: updated project with cover`;
    console.log(log);
    await job.log(log);

    return done();
  } catch (error) {
    if (error instanceof Error) {
      log = `${jobId}: ${error.message ?? "error"}`;
      console.error(log);
      return done(new Error(log));
    }
  }
};
