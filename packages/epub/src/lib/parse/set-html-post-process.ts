import * as cheerio from "cheerio";

export function setHtmlPostProcess($: cheerio.Root) {
  // Remove newlines and spaces from the text
  $("*").each(function (this: cheerio.Element) {
    const e = $(this);
    const html = e.html();

    if (!html) return;
    const removedNewlines = html.replace(/\n/g, " ");
    const removedConsecutiveSpaces = removedNewlines.replace(/\s+/g, " ");
    const trimmed = removedConsecutiveSpaces.trim();

    e.html(trimmed);
  });

  // Ensure text nodes are paragraphs
  $.root()
    .contents()
    .each(function (this: cheerio.Element) {
      if (this.type != "text") return;

      const e = $(this);
      const text = e.text();
      const split = text.split("\n");

      const joined = split
        .filter((s) => s.trim())
        .map((s) => `<p>${s.trim()}</p>`)
        .join("");

      e.replaceWith(joined);
    });

  // Remove empty tags that are not self-closing
  $("*").each(function (this: cheerio.Element) {
    const e = $(this);

    const selfClosingTags = ["img", "br", "hr"];
    const tag = e.prop("tagName")?.toLowerCase() ?? "";
    if (!selfClosingTags.includes(tag) && !e.text().trim()) {
      e.remove();
    }
  });

  return $;
}
