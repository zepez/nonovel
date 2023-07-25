import sharp from "sharp";

export const postProcessImage = async (
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
