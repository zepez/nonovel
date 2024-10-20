import * as cheerio from "cheerio";

export function getOpfPath(metaInfContent: string) {
  const $ = cheerio.load(metaInfContent, { xmlMode: true });

  const opfPath = $("rootfile").attr("full-path")?.trim();
  if (!opfPath) throw new Error("Failed to get OPF path");

  return opfPath;
}
