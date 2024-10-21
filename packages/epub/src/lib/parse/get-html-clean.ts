import * as cheerio from "cheerio";
import { TEpub } from "../..";
import { setHtmlPreProcess, setHtmlPostProcess } from ".";

export function getHtmlClean(html: NonNullable<TEpub["html"]["dirty"]>) {
  let $ = cheerio.load(html);

  $ = setHtmlPreProcess($);
  $ = setHtmlPostProcess($);

  return $.html().trim();
}
