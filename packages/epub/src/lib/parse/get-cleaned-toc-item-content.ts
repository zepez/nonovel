import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getCleanedTocItemContent(this: TEpub) {
  const withCleanedContent = this.tocItemContent.map((item) => {
    const $ = cheerio.load(item.html);

    // Remove html and body tags
    $("html, body").each(function () {
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
      const imgSrc = this.getPath(imgRelativeSrc);
      const imgBuffer = imgSrc ? this.get(imgSrc) : null;
      const imgBase64 = imgBuffer ? imgBuffer.toString("base64") : null;

      let mimetype = "";
      if (imgRelativeSrc?.endsWith(".jpg") || imgRelativeSrc?.endsWith(".jpeg"))
        mimetype = "image/jpeg";
      if (imgRelativeSrc?.endsWith(".png")) mimetype = "image/png";

      if (imgBase64 && mimetype)
        imgElement.attr("src", `data:${mimetype};base64,${imgBase64}`);
      else imgElement.remove();
    });

    // remove spanning tags
    $("a, span, strong, i, b").each(function () {
      const parentTag = $(this).parent()?.[0]?.name;
      const children = $(this).children();
      if (children.length) {
        // If the element has children, replace it with its inner HTML.
        $(this).replaceWith($(this).html() ?? "");
      } else {
        // If the element doesn't have children, replace it with its text.
        const text = $(this).text();
        // If there is no parent tag, wrap the text in a 'p' tag.
        if (!parentTag) {
          $(this).replaceWith(`<p>${text}</p>`);
        } else {
          $(this).replaceWith(text);
        }
      }
    });

    // Unwrap these tags
    while ($("div, ul, ol, li").length) {
      $("div, ul, ol, li").each(function () {
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
    $("*").each(function () {
      const selfClosingTags = ["img", "br", "hr"];
      if (
        !selfClosingTags.includes($(this).prop("tagName") ?? "") &&
        !$(this).text().trim()
      ) {
        $(this).remove();
      }
    });

    // Replace all text nodes with p tags
    $("p, h1, h2, h3, h4, h5, h6, pre").each(function () {
      $(this).replaceWith(`<p>${$(this).text()}</p>`);
    });

    // Remove newlines from the text
    $("*").each(function () {
      const elementHtml = $(this).html();
      if (elementHtml) {
        const removedNewlines = elementHtml.replace(/\n/g, " ");
        const removedConsecutiveSpaces = removedNewlines.replace(/\s+/g, " ");
        const trimmed = removedConsecutiveSpaces.trim();
        $(this).html(trimmed);
      }
    });

    return { ...item, html: $.html().trim() };
  });

  return withCleanedContent;
}
