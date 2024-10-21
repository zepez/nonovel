import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getPackageMetadata(
  getFilePath: TEpub["getFilePath"],
  getFileBuffer: TEpub["getFileBuffer"],
  opfContent: string
) {
  const $ = cheerio.load(opfContent, { xmlMode: true });

  const metadata = $("metadata");
  const metadataChildren = metadata.children();
  if (!metadata || !metadataChildren.length)
    throw new Error("Failed to get metadata");

  const title = $("dc\\:title").text().trim();
  if (!title) throw new Error("Failed to get title");

  const creator = $("dc\\:creator").text().trim();
  if (!creator) throw new Error("Failed to get creator");

  const coverId = $("meta[name='cover']").attr("content")?.trim() ?? null;

  const coverRelativePath = coverId
    ? $(`manifest item[id="${coverId}"]`).attr("href")
    : null;

  const coverPath = getFilePath(coverRelativePath);
  const coverBuffer = coverPath ? getFileBuffer(coverPath) ?? null : null;

  const publisher = $("dc\\:publisher").text()
    ? $("dc\\:publisher").text().trim()
    : null;

  const description = $("dc\\:description").text()
    ? $("dc\\:description").text().trim()
    : null;

  return {
    cover: { path: coverPath, buffer: coverBuffer },
    title,
    creator,
    publisher,
    description,
  };
}
