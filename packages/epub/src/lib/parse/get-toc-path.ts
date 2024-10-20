import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getTocPath(
  getFilePath: TEpub["getFilePath"],
  opfContent: string
) {
  const $ = cheerio.load(opfContent, { xmlMode: true });

  const tocId = $("spine").attr("toc")?.trim();
  if (!tocId) throw new Error("Failed to get TOC ID");

  const tocRelativePath = $(`manifest item[id=${tocId}]`).attr("href")?.trim();
  if (!tocRelativePath) throw new Error("Failed to get TOC path");

  const tocPath = getFilePath(tocRelativePath);
  if (!tocPath) throw new Error("Failed to get TOC path");

  return tocPath;
}
