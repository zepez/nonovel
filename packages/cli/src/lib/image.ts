import sharp from "sharp";
import { createCanvas } from "canvas";

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

export const generateCoverImage = ({
  title,
  author,
}: {
  title: string;
  author: string;
}) => {
  const canvas = createCanvas(600, 900);
  const context = canvas.getContext("2d");

  // Background
  context.fillStyle = "#FFEFD5";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  context.fillStyle = "#8B4513";
  context.font = "bold 70px sans-serif";
  context.textAlign = "center";
  context.fillText(title, canvas.width / 2, canvas.height / 2); // Centered

  // Author
  context.font = "40px sans-serif"; // Smaller font for author
  context.fillText(author, canvas.width / 2, canvas.height / 2 + 100); // Positioned under title

  const buffer = canvas.toBuffer("image/png");

  return processImageBuffer(buffer);
};
