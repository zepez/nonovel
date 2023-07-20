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
    .webp({ quality: 50, lossless: false })
    .withMetadata({}) // wipe all metadata
    .toBuffer();

  const base64Image = compressedImageBuffer.toString("base64");

  return "data:image/webp;base64," + base64Image;
};

export const generateCoverImage = async ({
  title,
  author,
  description,
}: {
  title: string;
  author: string;
  description: string;
}): Promise<Buffer> => {
  const aiImageBase64 = await generateStabilityImage([
    {
      text: `beautiful book illustration, ${title}, ${author}`,
      weight: 1,
    },
    {
      text: description,
      weight: 0.5,
    },
  ]);

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 600,
    height: 900,
  });

  await page.setContent(`
    <div class="cover">
      <div class="cover-inside">
        <div style="padding: 0px 20px">
          <h1 style="font-size: 75px; font-family: serif; padding-top: 150px">
            ${title}
          </h1>
          <h2 style="font-size: 35px">${author}</h2>
        </div>
        <h3 style="font-size: 25px">NoNovel.io</h3>
      </div>
    </div>

    <style>
      .cover {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        position: relative;
        font-family: sans-serif;
        text-shadow: black 0px 1px 5px;
      }
      .cover::before {
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        background-image: url(data:image/jpeg;base64,${aiImageBase64});
        background-size: cover;
        filter: grayscale(25%) blur(1px) brightness(0.5);
      }
      .cover-inside {
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
      }
    </style>
  `);

  // await page.setContent(`
  //   <div style="
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: space-between;
  //     height: 100%;
  //     width: 100%;
  //     background-image: url(data:image/jpeg;base64,${aiImageBase64});
  //     background-size: cover;
  //     color: white;
  //     font-family: sans-serif;
  //     text-align: center;
  //     border: ${borderWidth}px solid white;
  //     padding: ${padding}px;
  //     margin: 0px;
  //     box-sizing: border-box;
  //   ">
  //     <div style="
  //       background-color: rgba(255, 239, 213, 0.7);
  //       height: 100%;
  //       display: flex;
  //       flex-direction: column;
  //       justify-content: center;
  //       align-items: center;
  //     ">
  //       <h1 style="font-size: 50px;">${title}</h1>
  //       <h2 style="font-size: 35px;">${author}</h2>
  //     </div>
  //     <h3 style="font-size: 25px;">
  //       NoNovel.io
  //     </h3>
  //   </div>
  // `);

  const screenshot = await page.screenshot({ encoding: "binary" });

  await browser.close();

  return screenshot;
};
