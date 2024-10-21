export function setHtmlPreProcess($: cheerio.Root) {
  // Remove html and body tags
  $("html, body").each(function (this: cheerio.Element) {
    const e = $(this);
    const html = e.html();

    if (!html) return;
    e.replaceWith(html);
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

  // Replace these text tags with <p> tags
  // Preserve id attribute
  $("h4, h5, h6, pre, span, label").each(function (this: cheerio.Element) {
    const e = $(this);
    const id = e.prop("id");
    const props = id ? ` id=${id}` : "";

    e.replaceWith(`<p${props}>${e.html()}</p>`);
  });

  // Check if <a> href is real url
  // Otherwise replace <a> with <p> tags
  // Preserve id attribute
  $("a").each(function (this: cheerio.Element) {
    const e = $(this);
    const href = e.prop("href");
    const id = e.prop("id");
    const props = id ? ` id=${id}` : "";

    if (href && href.startsWith("http")) return;

    e.replaceWith(`<p${props}>${e.html()}</p>`);
  });

  // Prevent nesting of <p> tags
  $("p p").each(function (this: cheerio.Element) {
    const e = $(this);
    const text = e.text();

    if (!text) return;
    e.replaceWith(text);
  });

  return $;
}
