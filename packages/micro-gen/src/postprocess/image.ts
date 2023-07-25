import sharp from "sharp";

export const postprocessImage = async (
  imageBuffer: Buffer | null
): Promise<string | null> => {
  if (!imageBuffer) return null;

  const compressedBuffer = await sharp(imageBuffer)
    .resize({
      width: 300,
      withoutEnlargement: true,
    })
    .webp({ quality: 50, lossless: false })
    .withMetadata({})
    .toBuffer();

  const imageBase64 = compressedBuffer.toString("base64");

  return "data:image/webp;base64," + imageBase64;
};
