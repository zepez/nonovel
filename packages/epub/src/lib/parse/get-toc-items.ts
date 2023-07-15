import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getTocItems(this: TEpub) {
  const $ = cheerio.load(this.tocContent, { xmlMode: true });

  const tocItems = $("navMap navPoint").map((_, el) => {
    const $el = $(el);

    const name = $el.find("navLabel text").text();
    if (!name) throw new Error("Failed to get TOC item label");

    const relativeSrc = $el.find("content").attr("src");
    if (!relativeSrc) throw new Error("Failed to get TOC item content");

    const src = this.getPath(relativeSrc);
    if (!src) throw new Error("Failed to get TOC item href");

    const file = src.split("#")[0];
    if (!file) throw new Error("Failed to get TOC item file");

    const id = src.split("#")[1] ?? null;

    return { name, src, file, id, html: null };
  });

  return tocItems.toArray();
}
