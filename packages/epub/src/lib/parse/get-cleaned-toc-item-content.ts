import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { TocItem } from "../../types";

export function getCleanedTocItemContent(
  getFilePath: TEpub["getFilePath"],
  getFileBuffer: TEpub["getFileBuffer"],
  tocItems: TocItem<string>[]
) {
  const withCleanedContent = tocItems.map((item) => {
    const $ = cheerio.load(item.html);

    // Remove html and body tags
    $("html, body").each(function (this: cheerio.Element) {
      $(this).replaceWith($(this).html() ?? "");
    });

    // Remove these tags
    $("head").remove();
    $("script").remove();
    $("style").remove();
    $("svg").remove();
    $("meta").remove();
    $("link").remove();
    $("noscript").remove();
    $("iframe").remove();
    $("input").remove();
    $("button").remove();
    $("form").remove();
    $("select").remove();
    $("textarea").remove();
    $("option").remove();
    $("label").remove();

    // Remove these attributes
    $("[class]").removeAttr("class");
    $("[id]").removeAttr("id");
    $("[style]").removeAttr("style");
    $("[width]").removeAttr("width");
    $("[height]").removeAttr("height");

    // Convert all images to base64
    $("img").each((index, element) => {
      const imgElement = $(element);
      const imgRelativeSrc = imgElement.attr("src");
      const imgSrc = getFilePath(imgRelativeSrc);
      const imgBuffer = imgSrc ? getFileBuffer(imgSrc) : null;
      const imgBase64 = imgBuffer ? imgBuffer.toString("base64") : null;

      let mimetype = "";
      if (imgRelativeSrc?.endsWith(".jpg") || imgRelativeSrc?.endsWith(".jpeg"))
        mimetype = "image/jpeg";
      if (imgRelativeSrc?.endsWith(".png")) mimetype = "image/png";

      if (imgBase64 && mimetype) {
        imgElement.attr("src", `data:${mimetype};base64,${imgBase64}`);
      } else imgElement.remove();
    });

    // Replace these text nodes with p tags
    $("h4, h5, h6, pre, a, span").each(function (this: cheerio.Element) {
      $(this).replaceWith(`<p>${$(this).html()}</p>`);
    });

    // Prevent nesting of p tags
    $("p p").each(function (this: cheerio.Element) {
      const e = $(this);
      const text = e.text();
      if (text) e.replaceWith(text);
    });

    // Unwrap these tags
    while ($("div, ul, ol, li").length) {
      $("div, ul, ol, li").each(function (this: cheerio.Element) {
        // If the item is only text left, replace it with a p tag
        if ($(this).children().length === 0) {
          $(this).replaceWith(`<p>${$(this).text()}</p>`);
        } else {
          // otherwise replace it with its inner html
          const innerHtml = $(this).html() ?? "";
          $(this).replaceWith(innerHtml);
        }
      });
    }

    // Remove empty tags that are not self-closing
    $("*").each(function (this: cheerio.Element) {
      const selfClosingTags = ["img", "br", "hr"];
      const tag = $(this).prop("tagName")?.toLowerCase() ?? "";
      if (!selfClosingTags.includes(tag) && !$(this).text().trim()) {
        $(this).remove();
      }
    });

    // Remove newlines from the text
    $("*").each(function (this: cheerio.Element) {
      const elementHtml = $(this).html();
      if (elementHtml) {
        const removedNewlines = elementHtml.replace(/\n/g, " ");
        const removedConsecutiveSpaces = removedNewlines.replace(/\s+/g, " ");
        const trimmed = removedConsecutiveSpaces.trim();
        $(this).html(trimmed);
      }
    });

    // Ensure text nodes are paragraphs
    $.root()
      .contents()
      .each(function (this: cheerio.Element) {
        if (this.type === "text") {
          const text = $(this).text();
          const split = text.split("\n");
          const joined = split
            .filter((s) => s.trim())
            .map((s) => `<p>${s.trim()}</p>`)
            .join("");
          $(this).replaceWith(joined);
        }
      });

    return { ...item, html: $.html().trim() };
  });

  return withCleanedContent;
}
