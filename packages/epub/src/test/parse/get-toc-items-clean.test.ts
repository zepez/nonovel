import { expect, test } from "vitest";
import { getTocItemsClean } from "../../lib/parse";

const getFilePath = (fileName?: string | null) => fileName ?? null;
const getFileBuffer = (fileName: string) => new Buffer(fileName);

const clean = (c: string) => {
  const res = getTocItemsClean(
    getFilePath,
    getFileBuffer,
    [
      {
        name: "chapter",
        src: "OEBPS/101.xhtml",
        path: "OEBPS/101.xhtml",
        id: null,
        html: c,
      },
    ],
    {
      title: "title",
      creator: "creator",
      cover: { path: null, buffer: null },
      publisher: null,
      description: null,
    }
  );

  return res[0]?.html;
};

test("completely remove unwanted attributes", () => {
  let html: string | null = null;

  html = `<p class="remove">Some text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p id="remove">Some text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p style="remove">Some text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p width="remove">Some text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p height="remove">Some text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("unwrap unnecessary structure tags", () => {
  let html: string | null = null;

  html = `<div>Some text</div>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<ul>Some text</ul>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<ol>Some text</ol>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<li>Some text</li>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("keep basic stylistic elements", () => {
  let html: string | null = null;

  html = `<p>Some text <b>here</b></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <i>here</i></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <strong>here</strong></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <em>here</em></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <mark>here</mark></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <small>here</small></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <del>here</del></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <ins>here</ins></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <sub>here</sub></p>`;
  expect(clean(html)).toStrictEqual(html);

  html = `<p>Some text <sup>here</sup></p>`;
  expect(clean(html)).toStrictEqual(html);
});

test("unwrap nested structural tags", () => {
  let html: string | null = null;

  html = `<div><p>Some text</p></div>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<div><div><p>Some text</p></div></div>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<div><div><div><p>Some text</p></div></div></div>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p>Some <div>text</div> here</p>`;
  expect(clean(html)).toStrictEqual("<p>Some</p><p>text</p><p>here</p>");

  html = `<div>Some</div><div>text</div>`;
  expect(clean(html)).toStrictEqual("<p>Some</p><p>text</p>");

  html = `<strong><div><p>Some text</p></div></strong>`;
  expect(clean(html)).toStrictEqual("<strong><p>Some text</p></strong>");
});

test("replace image source with base64 or remove it", () => {
  let html: string | null = null;

  html = `<img>`;
  expect(clean(html)).toStrictEqual(``);

  html = `<img src="dogs.jpg">`;
  expect(clean(html)).toStrictEqual(
    `<img src="data:image/jpeg;base64,ZG9ncy5qcGc=" alt="title, chapter - Image 1">`
  );

  html = `<img alt="dogs" src="dogs.jpg">`;
  expect(clean(html)).toStrictEqual(
    `<img alt="title, chapter - Image 1. dogs" src="data:image/jpeg;base64,ZG9ncy5qcGc=">`
  );
});
