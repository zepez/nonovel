import sharp from "sharp";

export const postProcessImage = async (
  imageBuffer: Buffer
): Promise<Buffer> => {
  return await sharp(imageBuffer)
    .resize({
      width: 300,
      withoutEnlargement: true,
    })
    .webp({ quality: 50, lossless: false })
    .withMetadata({}) // wipe all metadata
    .toBuffer();
};
