import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getOpfMetadata(this: TEpub) {
  const $ = cheerio.load(this.opfContent, { xmlMode: true });

  const title = $("dc\\:title").text();
  if (!title) throw new Error("Failed to get title");

  const creator = $("dc\\:creator").text();
  if (!creator) throw new Error("Failed to get creator");

  const coverId = $("meta[name='cover']").attr("content") ?? null;

  const coverRelativePath = coverId
    ? $(`manifest item[id="${coverId}"]`).attr("href")
    : null;

  const coverPath = this.getPath(coverRelativePath);

  const coverBuffer = coverPath ? this.get(coverPath) : null;

  const cover = coverBuffer
    ? `data:image/jpeg;base64,${coverBuffer.toString("base64")}`
    : null;

  return { cover, title, creator };
}
