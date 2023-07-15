import { TEpub } from "../..";

export function getOpfContent(this: TEpub) {
  const opfContent = this.get(this.opfPath)?.toString();
  if (!opfContent) throw new Error("Failed to get OPF content");

  return opfContent;
}
