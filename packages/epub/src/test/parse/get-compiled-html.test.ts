import { expect, test } from "vitest";
import { getCompiledHtml } from "../../lib/parse";

const goodTocItems = [
  {
    name: "34",
    src: "OEBPS/101.xhtml#34",
    path: "OEBPS/101.xhtml",
    id: "34",
    html: null,
  },
  {
    name: "35",
    src: "OEBPS/101.xhtml#35",
    path: "OEBPS/101.xhtml",
    id: "35",
    html: null,
  },
  {
    name: "36",
    src: "OEBPS/102.xhtml#36",
    path: "OEBPS/102.xhtml",
    id: "36",
    html: null,
  },
];

const getFileStr = (fileName: string) => `<p>${fileName}</p>`;

test("return only unique HTML content for each TOC item", () => {
  const combined = getCompiledHtml(getFileStr, goodTocItems);

  expect(combined).toMatchInlineSnapshot(`
    "<p>OEBPS/101.xhtml</p><p>OEBPS/102.xhtml</p>"
  `);
});
