import { TEpub } from "../..";

export function getMetaInfContent(this: TEpub) {
  const metaInfContent = this.get("META-INF/container.xml")?.toString();

  if (!metaInfContent) throw new Error("Failed to get META-INF content");

  return metaInfContent;
}
