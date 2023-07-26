import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";

import config from "@nonovel/config-server";

const client = new S3Client({
  region: "auto",
  endpoint: config.S3_ENDPOINT,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  },
});

interface UploadOptions {
  buffer: Buffer;
  group: string;
  category: "cover";
  extOrFileName: "webp";
}

export const upload = async ({
  buffer,
  group,
  category,
  extOrFileName,
}: UploadOptions) => {
  const name = new Date().toISOString();

  const mimetype = mime.lookup(extOrFileName) || "application/octet-stream";
  const extension = mime.extension(mimetype) || "bin";

  const path = `${group}/${category}/${name}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: "nonovel",
    Key: path,
    Body: buffer,
    ContentType: mimetype,
  });

  await client.send(command);

  return path;
};
