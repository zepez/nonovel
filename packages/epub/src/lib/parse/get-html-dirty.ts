import { TEpub } from "../..";

export function getHtmlDirty(
  getFileStr: TEpub["getFileStr"],
  tocItems: NonNullable<TEpub["toc"]["items"]>
) {
  const uniqueFiles = Array.from(new Set(tocItems.map((item) => item.path)));

  const htmlContent = uniqueFiles.map((file) => {
    return getFileStr(file);
  });

  return htmlContent.join("");
}
