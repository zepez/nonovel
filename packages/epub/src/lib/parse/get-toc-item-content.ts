import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { TocItem } from "../../types";

function getSplitTocItemContent(
  index: number,
  tocItems: TocItem<null>[],
  compiledHtml: string
) {
  const item = tocItems[index];
  if (!item) throw new Error("NO-OP failed to get current TOC item");

  const currentId = item.id;
  if (!currentId) throw new Error("NO-OP failed to get current TOC item id");

  // # 1 get the next chapter id, so we know when to stop
  const nextId = tocItems[index + 1]?.id ?? null;

  // # 2 load all html into cheerio
  const $ = cheerio.load(compiledHtml);

  // # 3 get the start node
  const startNode = $(`#${currentId}`);

  // # 4 check if the start node is a <div> or not
  const wrapped = startNode.is("div");

  // # if the start node is not a div, get the html between nodes
  let chapterHtml = null;
  if (!wrapped) {
    const betweenNodes = nextId ? startNode.nextUntil(`#${nextId}`) : null;

    // there are nodes between the start and end node
    if (betweenNodes && betweenNodes?.length > 0) {
      const betweenNodesContent = betweenNodes
        ? betweenNodes.map((i, el) => $(el).prop("outerHTML")).get()
        : null;

      chapterHtml = betweenNodesContent ? betweenNodesContent.join("") : null;
    } else {
      // there are no nodes between the start and end node
      // (it's just a single element)
      chapterHtml = startNode.html();
    }
  }

  // otherwise just get the html from the start node
  if (wrapped) chapterHtml = startNode.html();

  if (!chapterHtml) throw new Error("Failed to gather chapter html");
  return { ...item, html: chapterHtml };
}

function getCompleteTocItemContent(
  index: number,
  tocItems: TocItem<null>[],
  getFileStr: TEpub["getFileStr"]
) {
  const item = tocItems[index];
  if (!item) throw new Error("NO-OP failed to get current TOC item");

  const raw = getFileStr(item.path);
  if (!raw) throw new Error("Failed to get chapter");

  // some files have extra data that needs to be removed
  const $ = cheerio.load(raw);
  const chapter = $("body");
  const chapterHtml = chapter.html();
  if (!chapterHtml) throw new Error("Failed to get chapter html");

  return { ...item, html: chapterHtml };
}

export function getTocItemContent(
  getFileStr: TEpub["getFileStr"],
  tocItems: TocItem<null>[],
  compiledHtml: string
) {
  const withContent = tocItems.map((item, itemIdx) => {
    if (item.id) return getSplitTocItemContent(itemIdx, tocItems, compiledHtml);

    return getCompleteTocItemContent(itemIdx, tocItems, getFileStr);
  });

  return withContent;
}
