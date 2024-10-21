import { expect, test } from "vitest";
import * as cheerio from "cheerio";
import { setHtmlPreProcess } from "../../lib/parse";

const process = (v: string) => {
  let $ = cheerio.load(v);
  $ = setHtmlPreProcess($);
  return $.html().trim();
};

test("unwrap <html> elements", () => {
  const html = `
    <html>
      <p id="test">Some text</p>
    </html>
  `;

  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);
});

test("unwrap <body> elements", () => {
  const html = `
    <body>
      <p id="test">Some text</p>
    </body>
  `;

  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);
});

test("completely remove unwanted elements", () => {
  const html = `
    <head>
      <p id="test">Some text</p>
    </head>
    <script scr="..." />
    <style><p>Some text</p></style>
    <svg><p>Some text</p></svg>
    <meta><p>Some text</p></meta>
    <link><p>Some text</p></link>
    <noscript><p>Some text</p></noscript>
    <iframe><p>Some text</p></iframe>
    <input><p>Some text</p></input>
    <button><p>Some text</p></button>
    <form><p>Some text</p></form>
    <select><p>Some text</p></select>
    <textarea><p>Some text</p></textarea>
    <option><p>Some text</p></option>
  `;

  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);
});

test("replace spanning tags", () => {
  let html: string | null = null;

  html = `<p id="test">Some <span>text</span></p>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);

  html = `<span id="test">Some text</span>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);

  html = `<pre id="test">Some text</pre>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);

  html = `<h4 id="test">Some text</h4>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);

  html = `<h5 id="test">Some text</h5>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);

  html = `<h6 id="test">Some text</h6>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);
});

test("preserve links with external href", () => {
  const html = `<a href="https://example.com" id="test">Some text</a>`;
  expect(process(html)).toStrictEqual(
    `<a href="https://example.com" id="test">Some text</a>`
  );
});

test("remove links with internal href", () => {
  const html = `<a href="example.xhtml" id="test">Some text</a>`;
  expect(process(html)).toStrictEqual(`<p id="test">Some text</p>`);
});

test("prevent nesting of <p> or text tags", () => {
  const html = `<p>Some<p>text</p></p>`;
  expect(process(html)).toStrictEqual(`<p>Some</p><p>text</p><p></p>`);
});

test("keep basic stylistic elements", () => {
  let html: string | null = null;

  html = `<p>Some text <b>here</b></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <i>here</i></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <strong>here</strong></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <em>here</em></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <mark>here</mark></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <small>here</small></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <del>here</del></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <ins>here</ins></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <sub>here</sub></p>`;
  expect(process(html)).toStrictEqual(html);

  html = `<p>Some text <sup>here</sup></p>`;
  expect(process(html)).toStrictEqual(html);
});
