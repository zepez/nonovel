import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getTocItemContent(this: TEpub) {
  const withContent = this.tocItems.map((item, itemIdx) => {
    const chapterId = item.id;

    // chapter source looks like this: OEBPS/7499723228361436363_2701-h-6.htm.xhtml#pgepubid00096
    if (chapterId) {
      // # 1 get the next chapter id, so we know when to stop
      const nextChapterId = this.tocItems[itemIdx + 1]?.id ?? null;
      // # 2 load all html into cheerio
      const $ = cheerio.load(this.compiledHtml);
      // # 3 get the start node
      const startNode = $(`#${chapterId}`);
      // # 4 check if the start node is a <div> or not
      const wrapped = startNode.is("div");

      // # if the start node is not a div, get the html between nodes
      let gatheredChapterHtml = null;
      if (!wrapped) {
        const betweenNodes = nextChapterId
          ? startNode.nextUntil(`#${nextChapterId}`)
          : null;

        // there are nodes between the start and end node
        if (betweenNodes && betweenNodes?.length > 0) {
          const betweenNodesContent = betweenNodes
            ? betweenNodes.map((i, el) => $(el).prop("outerHTML")).get()
            : null;

          gatheredChapterHtml = betweenNodesContent
            ? betweenNodesContent.join("")
            : null;
        } else {
          // there are no nodes between the start and end node
          // (it's just a single element)
          gatheredChapterHtml = startNode.html();
        }
      }

      // otherwise just get the html from the start node
      if (wrapped) {
        gatheredChapterHtml = startNode.html();
      }

      if (!gatheredChapterHtml)
        throw new Error("Failed to gather chapter html");
      return { ...item, html: gatheredChapterHtml };
    } else {
      // chapter source looks like this: OEBPS/7499723228361436363_2701-h-6.htm.xhtml
      const raw = this.get(item.file)?.toString();
      if (!raw) throw new Error("Failed to get chapter");

      const $ = cheerio.load(raw);
      const chapter = $("body");
      const chapterHtml = chapter.html();
      if (!chapterHtml) throw new Error("Failed to get chapter html");

      return { ...item, html: chapterHtml };
    }
  });

  return withContent;
}
