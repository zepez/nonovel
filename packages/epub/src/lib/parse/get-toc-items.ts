// import * as cheerio from "cheerio";
// import { TEpub } from "../..";

// export function getTocItems(this: TEpub) {
//   const $ = cheerio.load(this.tocContent, { xmlMode: true });

//   const tocItems = $("navMap navPoint").map((_, el) => {
//     const $el = $(el);

//     const name = $el.find("navLabel text").text();
//     if (!name) throw new Error("Failed to get TOC item label");

//     const relativeSrc = $el.find("content").attr("src");
//     if (!relativeSrc) throw new Error("Failed to get TOC item content");

//     const src = this.getPath(relativeSrc);
//     if (!src) throw new Error("Failed to get TOC item href");

//     const file = src.split("#")[0];
//     if (!file) throw new Error("Failed to get TOC item file");

//     const id = src.split("#")[1] ?? null;

//     return { name, src, file, id, html: null };
//   });

//   return tocItems.toArray();
// }

import * as cheerio from "cheerio";
import { TEpub } from "../..";

interface TocItem {
  name: string;
  src: string;
  file: string;
  id: string | null;
  html: null;
}

function parseNavPoint(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<cheerio.Element>,
  parentLabel = "",
  getPath: (src: string) => string | null
): TocItem[] {
  const name = $el.find("> navLabel > text").first().text();
  if (!name) throw new Error("Failed to get TOC item label");

  const combinedName = parentLabel ? `${parentLabel}: ${name}` : name;

  const relativeSrc = $el.find("> content").attr("src");
  if (!relativeSrc) throw new Error("Failed to get TOC item content");

  const src = getPath(relativeSrc);
  if (!src) throw new Error("Failed to get TOC item href");

  const file = src.split("#")[0];
  if (!file) throw new Error("Failed to get TOC item file");

  const id = src.split("#")[1] ?? null;

  const item = { name: combinedName, src, file, id, html: null };

  let childrenItems: TocItem[] = [];
  $el.find("> navPoint").each((_, el) => {
    const childEl = $(el);
    childrenItems = [
      ...childrenItems,
      ...parseNavPoint($, childEl, combinedName, getPath),
    ];
  });

  return [item, ...childrenItems];
}

export function getTocItems(this: TEpub) {
  const $ = cheerio.load(this.tocContent, { xmlMode: true });

  let tocItems: TocItem[] = [];
  $("navMap > navPoint").each((_, el) => {
    const $el = $(el);
    tocItems = [
      ...tocItems,
      ...parseNavPoint($, $el, "", this.getPath.bind(this)),
    ];
  });

  return tocItems;
}
