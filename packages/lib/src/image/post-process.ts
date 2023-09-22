import sharp from "sharp";

export const postProcessImage = async (
  imageBuffer: Buffer
): Promise<Buffer> => {
  return await sharp(imageBuffer)
    .resize({
      width: 500,
      withoutEnlargement: true,
    })
    .jpeg({ quality: 100 })
    .withMetadata({})
    .toBuffer();
};
