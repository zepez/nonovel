import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { TocItem } from "../../types";

function parseNavPoint(
  $: cheerio.Root,
  $el: cheerio.Cheerio,
  parentLabel = "",
  getPath: (src: string) => string | null
): TocItem<null>[] {
  const name = $el.find("> navLabel > text").first().text();
  if (!name) throw new Error("Failed to get TOC item label");

  const combinedName = parentLabel ? `${parentLabel}: ${name}` : name;

  const relativeSrc = $el.find("> content").attr("src");
  if (!relativeSrc) throw new Error("Failed to get TOC item content");

  const src = getPath(relativeSrc);
  if (!src) throw new Error("Failed to get TOC item href");

  const path = src.split("#")[0];
  if (!path) throw new Error("Failed to get TOC item path");

  const id = src.split("#")[1] ?? null;

  const item = { name: combinedName, src, path, id, html: null };

  let childrenItems: TocItem<null>[] = [];
  $el.find("> navPoint").each((_, el) => {
    const childEl = $(el);
    childrenItems = [
      ...childrenItems,
      ...parseNavPoint($, childEl, combinedName, getPath),
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
    const $el = $(el);
    tocItems = [...tocItems, ...parseNavPoint($, $el, "", getFilePath)];
  });

  return tocItems;
}
