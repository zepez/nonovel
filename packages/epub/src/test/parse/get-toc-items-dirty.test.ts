import { expect, test } from "vitest";
import { getTocItemsDirty } from "../../lib/parse";

const item = (i: number, page = 101) => {
  const split = page === 101;

  return {
    name: `${i}`,
    src: `OEBPS/${page}.xhtml${split ? `#${i}` : ""}`,
    path: `OEBPS/${page}.xhtml`,
    id: split ? `${i}` : null,
    html: null,
  };
};

const t = [
  item(0, 102),
  item(1),
  item(2),
  item(3),
  item(4),
  item(5),
  item(6),
  item(7),
  item(8),
];
const h = `
  <div id="1"><p>Chapter 1</p></div>
  <div id="2"><p>Chapter 2</p></div>
  <div id="3">
    <p>Chapter 3</p>
  </div>
  <div id="4">
    <p>Chapter 4</p>
    <p>Sentence</p>
    <p>Sentence</p>
    <p>Sentence</p>
    <p>Sentence</p>
  </div>
  <p id="5">Chapter 5</p>
  <p id="6">Chapter 6</p>
  <p>Sentence</p>
  <p>Sentence</p>
  <p>Sentence</p>
  <p>Sentence</p>
  <div id="7">
    <p>Chapter 7</p>
    <p>Sentence</p>
    <p id="8">Chapter 8</p>
    <p>Sentence</p>
  </div>
`;

const getFileStr = (fileName: string) => `<p>${fileName}</p>`;

// NOTE: removed whitespace for easier comparison
const toc = getTocItemsDirty(getFileStr, t, h).map((v) => ({
  ...v,
  html: v.html.replace(/\s+/g, ""),
}));

test("return the raw file content if no id is present", () => {
  const html = toc[0]?.html ?? null;
  expect(html).toBe(
    `<html><head></head><body><p>OEBPS/102.xhtml</p></body></html>`
  );
});

test("split each chapter by ids if they are present", () => {
  let html: string | null = null;

  html = toc[1]?.html ?? null;
  expect(html).toBe(`<divid="1"><p>Chapter1</p></div>`);

  html = toc[2]?.html ?? null;
  expect(html).toBe(`<divid="2"><p>Chapter2</p></div>`);
});

test("return the full chapter when wrapped", () => {
  let html: string | null = null;

  html = toc[3]?.html.trim() ?? null;
  expect(html).toBe(`<divid="3"><p>Chapter3</p></div>`);

  html = toc[4]?.html.trim() ?? null;
  expect(html).toBe(
    `<divid="4"><p>Chapter4</p><p>Sentence</p><p>Sentence</p><p>Sentence</p><p>Sentence</p></div>`
  );
});

test("return the full chapter when unwrapped", () => {
  let html: string | null = null;

  html = toc[5]?.html.trim() ?? null;
  expect(html).toBe(`<divid="5"><p>Chapter5</p></div>`);

  html = toc[6]?.html.trim() ?? null;
  expect(html).toBe(
    `<divid="6"><p>Chapter6</p><p>Sentence</p><p>Sentence</p><p>Sentence</p><p>Sentence</p></div>`
  );
});

test("return split nested chapters", () => {
  let html: string | null = null;

  html = toc[7]?.html.trim() ?? null;
  expect(html).toBe(`<divid="7"><p>Chapter7</p><p>Sentence</p></div>`);

  html = toc[8]?.html.trim() ?? null;
  expect(html).toBe(`<divid="8"><p>Chapter8</p><p>Sentence</p></div>`);
});
