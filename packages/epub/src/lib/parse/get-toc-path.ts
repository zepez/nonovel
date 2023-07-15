import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getTocPath(this: TEpub) {
  const $ = cheerio.load(this.opfContent, { xmlMode: true });

  const tocId = $("spine").attr("toc");
  if (!tocId) throw new Error("Failed to get TOC ID");

  const tocRelativePath = $(`manifest item[id=${tocId}]`).attr("href");
  if (!tocRelativePath) throw new Error("Failed to get TOC path");

  const tocPath = this.getPath(tocRelativePath);
  if (!tocPath) throw new Error("Failed to get TOC path");

  return tocPath;
}
