import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { setHtmlPreProcess, setHtmlPostProcess } from ".";
import { TocItem } from "../../types";

export function getTocItemsClean(
  getFilePath: TEpub["getFilePath"],
  getFileBuffer: TEpub["getFileBuffer"],
  tocItems: TocItem<string>[],
  metadata: NonNullable<TEpub["package"]["metadata"]>
) {
  const withCleanedContent = tocItems.map((item) => {
    let $ = cheerio.load(item.html);

    $ = setHtmlPreProcess($);

    // Remove these attributes
    $("[class]").removeAttr("class");
    $("[id]").removeAttr("id");
    $("[style]").removeAttr("style");
    $("[width]").removeAttr("width");
    $("[height]").removeAttr("height");

    // Convert all images to base64
    $("img").each(function (this: cheerio.Element, index: number) {
      const e = $(this);

      const relative = e.attr("src") ?? null;
      const absolute = getFilePath(relative);
      const buffer = absolute ? getFileBuffer(absolute) : null;
      const base64 = buffer ? buffer.toString("base64") : null;

      let mimetype = null;
      const jpeg = ["jpg", "jpeg"];
      const png = ["png"];

      const extension = relative?.split(".").pop() ?? "";
      if (jpeg.includes(extension)) mimetype = "image/jpeg";
      if (png.includes(extension)) mimetype = "image/png";

      if (base64 && mimetype) {
        e.attr("src", `data:${mimetype};base64,${base64}`);

        const alt = e.attr("alt") ?? null;
        e.attr(
          "alt",
          `${metadata.title}, ${item.name} - Image ${index + 1}${
            alt ? `. ${alt}` : ""
          }`
        );
      } else {
        e.remove();
      }
    });

    // Unwrap these tags
    while ($("div, ul, ol, li").length) {
      $("div, ul, ol, li").each(function (this: cheerio.Element) {
        const e = $(this);

        // If the item is only text left, replace it with a p tag
        if (e.children().length === 0) {
          e.replaceWith(`<p>${e.text()}</p>`);
        } else {
          // otherwise replace it with its inner html
          const innerHtml = e.html() ?? "";
          e.replaceWith(innerHtml);
        }
      });
    }

    $ = setHtmlPostProcess($);

    return { ...item, html: $.html().trim() };
  });

  return withCleanedContent;
}
