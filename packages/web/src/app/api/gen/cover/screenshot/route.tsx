import { NextResponse } from "next/server";
import { headers } from "next/headers";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { eq } from "drizzle-orm";

import config from "@nonovel/config-server";
import { db, project as projectTable } from "@nonovel/db";
import { getProjectById } from "@nonovel/query";
import { postProcessImage } from "@nonovel/lib";
import { upload } from "@nonovel/blob";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const auth = headersList.get("Authorization");

    if (!auth || auth !== `Bearer ${config.NB_GEN_SECRET_KEY}`)
      throw new Error("Unauthorized");

    const url = new URL(request.url);
    const res = (await request.json()) as { id: string };

    const [projectErr, project] = await getProjectById({ id: res.id });

    if (projectErr || !project || !project.penName)
      throw new Error("Project not found");

    const options = process.env.AWS_REGION
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        }
      : {
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--single-process",
          ],
          defaultViewport: chromium.defaultViewport,
          executablePath:
            process.platform === "win32"
              ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
              : process.platform === "linux"
              ? "/usr/bin/google-chrome"
              : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          // headless: true,
          headless: false,
          slowMo: 1000,
          devtools: false,
        };

    const puppeteerBrowser = await puppeteer.launch(options);
    const puppeteerPage = await puppeteerBrowser.newPage();

    await puppeteerPage.setViewport({
      width: 600,
      height: 900,
    });

    await puppeteerPage.setExtraHTTPHeaders({
      Authorization: `Bearer ${config.NB_GEN_SECRET_KEY}`,
    });

    await puppeteerPage.goto(`${url.origin}/cover?id=${project.id}`);

    const rawImageBuffer = await puppeteerPage.screenshot({
      encoding: "binary",
    });

    await puppeteerBrowser.close();

    const postProcessedImage = await postProcessImage(rawImageBuffer);
    const path = await upload({
      buffer: postProcessedImage,
      group: project.slug,
      category: "cover",
      extOrFileName: "jpeg",
    });

    await db
      .update(projectTable)
      .set({
        cover: path,
      })
      .where(eq(projectTable.id, project.id));

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error) console.log(`${e.message}`);
    return (
      NextResponse.json({
        success: false,
      }),
      { status: 500 }
    );
  }
}
