import * as cheerio from "cheerio";
import { TEpub } from "../..";

export function getOpfPath(this: TEpub) {
  const $ = cheerio.load(this.metaInfContent, { xmlMode: true });

  const opfPath = $("rootfile").attr("full-path");
  if (!opfPath) throw new Error("Failed to get OPF path");

  return opfPath;
}
