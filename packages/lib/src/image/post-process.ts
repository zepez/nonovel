import sharp from "sharp";

export const postProcessImage = async (
  imageBuffer: Buffer
): Promise<Buffer> => {
  return await sharp(imageBuffer)
    .resize({
      width: 300,
      withoutEnlargement: true,
    })
    .jpeg({ quality: 100 })
    .withMetadata({}) // wipe all metadata
    .toBuffer();
};
