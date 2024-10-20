import { TEpub } from "../..";

export function getCompiledHtml(
  getFileStr: TEpub["getFileStr"],
  tocItems: TEpub["tocItems"]
) {
  const uniqueFiles = Array.from(new Set(tocItems.map((item) => item.path)));

  const htmlContent = uniqueFiles.map((file) => {
    return getFileStr(file);
  });

  return htmlContent.join("");
}
