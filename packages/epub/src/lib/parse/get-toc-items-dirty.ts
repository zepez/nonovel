import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { TocItem } from "../../types";

const traverse = (
  $: cheerio.Root,
  currentId: string,
  nextId: string | null
) => {
  // Start = item with currentId
  const start = $(`#${currentId}`);

  // Next = next sibling after start
  let next = start.next();
  const siblings = [start];

  // Check if chapter content is "wrapped"
  // It doesn't matter if the element is a <div> or not
  // What matters is if it is NOT wrapped
  // We need a single reference by which to reference the chapter
  // It is okay if we, for example, wrap a <section> with an extra <div>
  const isWrapped = start.is("div");
  if (!isWrapped) start.removeAttr("id");

  // Actual traversal. Get all siblings
  while (next.length > 0 && next.attr("id") !== nextId) {
    siblings.push(next);
    next = next.next();
  }

  // Get outerHTML as a joined string
  const chapter = $(siblings)
    .map((_, el) => $(el).prop("outerHTML") as string)
    .get()
    .join("");

  // Go back and remove all siblings, except for the starting node
  // We will replace the starting node later
  siblings.forEach((el, i) => i != 0 && el.remove());

  // Wrap the chapter in a div, if not already
  // As previously mentioned, we need a single
  // reference point for the chapter
  const wrapped = isWrapped
    ? chapter
    : `<div id="${currentId}">${chapter}</div>`;

  // Finally remove the last remaining node of the
  // original chapter with the wrapped chapter
  start.replaceWith(wrapped);
};

const hatch = ($: cheerio.Root, f: cheerio.Root, currentId: string) => {
  // Must clone the node, as it would be removed from the original document
  const chapter = $(`#${currentId}`).clone();
  // Append the cloned node to the new, flattened document
  f("body").append(chapter);
};

const murder = ($: cheerio.Root, currentId: string, nextId: string | null) => {
  const chapter = $(`#${currentId}`);
  const nested = chapter.find(`#${nextId}`);

  // We already have a reference to a non-nested version
  // of the chapter in the hatched document
  // We need to remove the nested version
  if (nested.length > 0 && nextId) {
    nested.remove();
  }

  return chapter.prop("outerHTML") as string;
};

function getCompleteTocItemContent(
  index: number,
  item: TocItem<null>,
  getFileStr: TEpub["getFileStr"]
) {
  const raw = getFileStr(item.path);
  if (!raw) throw new Error("Failed to get chapter");

  const $ = cheerio.load(raw);
  return $.html();
}

export function getTocItemsDirty(
  getFileStr: TEpub["getFileStr"],
  toc: TocItem<null>[],
  html: string
) {
  const original = cheerio.load(html);
  const hatched = cheerio.load("");

  // traverse all chapters and wrap with <div>
  toc.forEach((item, i) => {
    const { id } = item;
    const nextId = toc[i + 1]?.id ?? null;
    if (!id) return;
    traverse(original, id, nextId);
  });

  // flatten chapters
  toc.forEach((item) => {
    const { id } = item;
    if (!id) return;
    hatch(original, hatched, id);
  });

  const result = toc.map((item, i) => {
    const { id } = item;
    const nextId = toc[i + 1]?.id ?? null;

    if (!id) {
      const html = getCompleteTocItemContent(i, item, getFileStr);
      return { ...item, html };
    }

    // remove nesting
    const html = murder(hatched, id, nextId);
    return { ...item, html };
  });

  return result;
}
