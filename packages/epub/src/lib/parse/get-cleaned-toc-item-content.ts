import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getCleanedTocItemContent(this: TEpub) {
  const withCleanedContent = this.tocItemContent.map((item) => {
    const $ = cheerio.load(item.html);

    // Convert all images to base64
    $("img").each((index, element) => {
      const imgElement = $(element);
      const imgRelativeSrc = imgElement.attr("src");
      const imgSrc = this.getPath(imgRelativeSrc);
      const imgBuffer = imgSrc ? this.get(imgSrc) : null;
      const imgBase64 = imgBuffer ? imgBuffer.toString("base64") : null;

      if (imgBase64)
        imgElement.attr("src", `data:image/jpeg;base64,${imgBase64}`);
      else imgElement.remove();
    });

    // Remove these attributes
    $("[class]").removeAttr("class");
    $("[id]").removeAttr("id");
    $("[style]").removeAttr("style");

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

    // remove spanning tags
    $("a, span, strong, i, b").each(function () {
      $(this).replaceWith($(this).text());
    });

    // Replace all text nodes with p tags
    $("p, h1, h2, h3, h4, h5, h6").each(function () {
      $(this).replaceWith(`<p>${$(this).text()}</p>`);
    });

    $("html, body").each(function () {
      $(this).replaceWith($(this).html() ?? "");
    });

    return { ...item, html: $.html() };
  });

  return withCleanedContent;
}
