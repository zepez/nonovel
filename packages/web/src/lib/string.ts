import config from "@nonovel/config-client";

export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const naturalListJoin = (index: number, length: number) => {
  const total = length - 1;

  if (index === total) return "";
  if (index === total - 1) return " and ";
  return ", ";
};

export const src = (src: string) => {
  if (src.startsWith("data:image") || src.startsWith("/")) return src;

  const segments = src
    .split("/")
    .map((segment) => encodeURIComponent(segment).replace(/'/g, "%27"));
  const reformed = segments.join("/");
  return `https://${config.NEXT_PUBLIC_S3_DOMAIN}/${reformed}`;
};
