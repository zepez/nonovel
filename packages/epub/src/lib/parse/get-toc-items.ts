import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { TocItem } from "../../types";

function parseNavPoint(
  $: cheerio.Root,
  e: cheerio.Cheerio,
  parent = "",
  getFilePath: (src: string) => string | null
): TocItem<null>[] {
  const name = e.find("> navLabel > text").first().text();
  if (!name) throw new Error("Failed to get TOC item label");

  const combinedName = parent ? `${parent}: ${name}` : name;

  const relativeSrc = e.find("> content").attr("src");
  if (!relativeSrc) throw new Error("Failed to get TOC item content");

  const src = getFilePath(relativeSrc);
  if (!src) throw new Error("Failed to get TOC item href");

  const path = src.split("#")[0];
  if (!path) throw new Error("Failed to get TOC item path");

  const id = src.split("#")[1] ?? null;

  const item = { name: combinedName, src, path, id, html: null };

  let childrenItems: TocItem<null>[] = [];
  e.find("> navPoint").each((_, el) => {
    const child = $(el);
    childrenItems = [
      ...childrenItems,
      ...parseNavPoint($, child, combinedName, getFilePath),
    ];
  });

  return [item, ...childrenItems];
}

export function getTocItems(
  getFilePath: TEpub["getFilePath"],
  tocContent: string
) {
  if (!tocContent || tocContent === "") {
    throw new Error("TOC content is empty or malformed");
  }

  const $ = cheerio.load(tocContent, { xmlMode: true });

  let tocItems: TocItem<null>[] = [];
  $("navMap > navPoint").each((_, el) => {
    const e = $(el);
    tocItems = [...tocItems, ...parseNavPoint($, e, "", getFilePath)];
  });

  return tocItems;
}
