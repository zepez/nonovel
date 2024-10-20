import config from "@nonovel/config-client";

export * from "./title-case";

export const naturalListJoin = (index: number, length: number) => {
  const total = length - 1;

  if (index === total) return "";
  if (index === total - 1) return " and ";
  return ", ";
};

export const src = (src: string | null | undefined) => {
  if (!src) return "";

  if (
    src.startsWith("data:image") ||
    src.startsWith("/") ||
    src.startsWith("http")
  )
    return src;

  const segments = src
    .split("/")
    .map((segment) => encodeURIComponent(segment).replace(/'/g, "%27"));
  const reformed = segments.join("/");
  return `https://${config.NEXT_PUBLIC_S3_DOMAIN}/${reformed}`;
};

export const clamp = (str: string | null | undefined, clmp: number) => {
  if (!str) return "";

  return str.length > clmp ? str.substring(0, clmp).trim() + "..." : str;
};
