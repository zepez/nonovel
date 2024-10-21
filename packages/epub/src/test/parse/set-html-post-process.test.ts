import { expect, test } from "vitest";
import * as cheerio from "cheerio";
import { setHtmlPreProcess, setHtmlPostProcess } from "../../lib/parse";

const process = (v: string) => {
  let $ = cheerio.load(v);
  $ = setHtmlPreProcess($);
  $ = setHtmlPostProcess($);
  return $.html().trim();
};

test("remove newlines and extra spaces from the text", () => {
  let html: string | null = null;

  html = `<p>Some \n text</p>`;
  expect(process(html)).toStrictEqual("<p>Some text</p>");

  html = `
    <p>Some \n text</p>\n\n\n
    <p>Some \n text</p>\n
    <p>Some \n text</p>
  `;
  expect(process(html)).toStrictEqual(
    `<p>Some text</p><p>Some text</p><p>Some text</p>`
  );

  html = `<p>Some         text</p>`;
  expect(process(html)).toStrictEqual(`<p>Some text</p>`);

  html = `<p>Some text</p>         <p>Some text</p>`;
  expect(process(html)).toStrictEqual(`<p>Some text</p><p>Some text</p>`);

  html = `<p>Some text          </p>`;
  expect(process(html)).toStrictEqual(`<p>Some text</p>`);
});

test("wrap orphaned text nodes with paragraph tags", () => {
  const html = `Some text`;
  expect(process(html)).toStrictEqual("<p>Some text</p>");
});

test("remove empty text tags", () => {
  let html: string | null = null;

  html = `<p></p>`;
  expect(process(html)).toStrictEqual(``);

  html = `<span></span>`;
  expect(process(html)).toStrictEqual(``);

  html = `<h1></h1>`;
  expect(process(html)).toStrictEqual(``);

  html = `<h2></h2>`;
  expect(process(html)).toStrictEqual(``);

  html = `<h3></h3>`;
  expect(process(html)).toStrictEqual(``);

  html = `<h4></h4>`;
  expect(process(html)).toStrictEqual(``);

  html = `<h5></h5>`;
  expect(process(html)).toStrictEqual(``);

  html = `<h6></h6>`;
  expect(process(html)).toStrictEqual(``);

  html = `<b></b>`;
  expect(process(html)).toStrictEqual(``);

  html = `<i></i>`;
  expect(process(html)).toStrictEqual(``);

  html = `<strong></strong>`;
  expect(process(html)).toStrictEqual(``);
});

test("preserve self-closing tags", () => {
  let html: string | null = null;

  html = `<img>`;
  expect(process(html)).toStrictEqual(`<img>`);

  html = `<br>`;
  expect(process(html)).toStrictEqual(`<br>`);

  html = `<hr>`;
  expect(process(html)).toStrictEqual(`<hr>`);
});

test("remove empty tags that are not self-closing", () => {
  let html: string | null = null;

  html = `<p>Some <br /> text</p>`;
  expect(process(html)).toStrictEqual("<p>Some <br> text</p>");

  html = `<p>Some text</p> <br />`;
  expect(process(html)).toStrictEqual("<p>Some text</p><br>");

  html = `<p>Some <hr /> text</p>`;
  expect(process(html)).toStrictEqual("<p>Some</p><hr><p>text</p>");

  html = `<p>Some text</p> <hr />`;
  expect(process(html)).toStrictEqual("<p>Some text</p><hr>");

  html = `<p>Some text</p> <img />`;
  expect(process(html)).toStrictEqual("<p>Some text</p><img>");
});
