import sharp from "sharp";
import puppeteer from "puppeteer";

import { generateStabilityImage } from "./prompt";

export const processImageBuffer = async (
  imageBuffer: Buffer | null
): Promise<string | null> => {
  if (!imageBuffer) return null;

  const compressedImageBuffer = await sharp(imageBuffer)
    .resize({
      width: 300,
      withoutEnlargement: true,
    })
    .webp({ quality: 20, lossless: false })
    .withMetadata({}) // wipe all metadata
    .toBuffer();

  const base64Image = compressedImageBuffer.toString("base64");

  return "data:image/webp;base64," + base64Image;
};

export const generateCoverImage = async ({
  title,
  author,
}: {
  title: string;
  author: string;
}): Promise<Buffer> => {
  const aiImageBase64 = await generateStabilityImage({
    prompt: `${title} by ${author}`,
  });

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  const borderWidth = 4;
  const padding = 20;

  await page.setViewport({
    width: 600,
    height: 900,
  });

  await page.setContent(`
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      background-color: #FFEFD5;
      color: #8B4513;
      font-family: sans-serif;
      text-align: center;
      border: ${borderWidth}px solid #8B4513;
      padding: ${padding}px;
      margin: 0px;
      box-sizing: border-box;
    ">
      <div>
        <h1 style="font-size: 50px;">${title}</h1>
        <h2 style="font-size: 35px;">${author}</h2>
        <img src="data:image/jpeg;base64,${aiImageBase64}" style="width: 100%; height: 400px; background-size: cover; margin-top: 50px;" />
      </div>
      <h3 style="font-size: 25px;">
        NoNovel.io
      </h3>
    </div>
  `);

  const screenshot = await page.screenshot({ encoding: "binary" });

  await browser.close();

  return screenshot;
};
