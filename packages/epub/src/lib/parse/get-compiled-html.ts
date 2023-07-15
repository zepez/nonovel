import { TEpub } from "../..";

export function getCompiledHtml(this: TEpub) {
  const uniqueFiles = Array.from(
    new Set(this.tocItems.map((item) => item.file))
  );

  const htmlContent = uniqueFiles.map((file) => {
    const html = this.get(file)?.toString();
    if (!html) throw new Error("Failed to get HTML content");

    return html;
  });

  return htmlContent.join("");
}
