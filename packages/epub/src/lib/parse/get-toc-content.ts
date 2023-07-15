import { TEpub } from "../..";

export function getTocContent(this: TEpub) {
  const tocPath = this.getTocPath();

  const tocContent = this.get(tocPath)?.toString();
  if (!tocContent) throw new Error("Failed to get TOC content");

  return tocContent;
}
