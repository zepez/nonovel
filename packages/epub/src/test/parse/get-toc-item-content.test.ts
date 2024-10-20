import { expect, test } from "vitest";
import { getTocItemContent } from "../../lib/parse";

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
    src: "OEBPS/102.xhtml",
    path: "OEBPS/102.xhtml",
    id: null,
    html: null,
  },
];

const compiledHtml = `
  <div id="34"><p>Chapter 34</p></div>
  <div id="35"><p>Chapter 35</p></div>
`;

const getFileStr = (fileName: string) => `<p>${fileName}</p>`;

test("return each chapter split by ids if they are present", () => {
  const toc = getTocItemContent(getFileStr, goodTocItems, compiledHtml);

  expect(toc[0]).toStrictEqual({
    name: "34",
    src: "OEBPS/101.xhtml#34",
    path: "OEBPS/101.xhtml",
    id: "34",
    html: "<p>Chapter 34</p>",
  });

  expect(toc[1]).toStrictEqual({
    name: "35",
    src: "OEBPS/101.xhtml#35",
    path: "OEBPS/101.xhtml",
    id: "35",
    html: "<p>Chapter 35</p>",
  });
});

test("return the raw file content if no id is present", () => {
  const toc = getTocItemContent(getFileStr, goodTocItems, compiledHtml);

  expect(toc[2]).toStrictEqual({
    name: "36",
    src: "OEBPS/102.xhtml",
    path: "OEBPS/102.xhtml",
    id: null,
    html: "<p>OEBPS/102.xhtml</p>",
  });
});
