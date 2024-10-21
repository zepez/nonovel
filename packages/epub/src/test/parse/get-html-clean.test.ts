import { expect, test } from "vitest";
import { getHtmlClean } from "../../lib/parse";

test("unwrap <html> elements", () => {
  const html = `
    <html>
      <p>Some text
    </html>
  `;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");
});

test("unwrap <body> elements", () => {
  const html = `
    <body>
      <p>Some text</p>
    </body>
  `;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");
});

test("completely remove unwanted elements", () => {
  const html = `
    <head>
      <p>Some text</p>
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

  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");
});

test("convert unnecessary text tags to <p> tags", () => {
  let html: string | null = null;

  html = `<h4>Some text</h4>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");

  html = `<h5>Some text</h5>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");

  html = `<h6>Some text</h6>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");

  html = `<pre>Some text</pre>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");
});

test("keep basic stylistic elements", () => {
  let html: string | null = null;

  html = `<p>Some text <b>here</b></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <i>here</i></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <strong>here</strong></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <em>here</em></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <mark>here</mark></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <small>here</small></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <del>here</del></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <ins>here</ins></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <sub>here</sub></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);

  html = `<p>Some text <sup>here</sup></p>`;
  expect(getHtmlClean(html)).toStrictEqual(html);
});

test("remove newlines and extra spaces from the text", () => {
  let html: string | null = null;

  html = `<p>Some \n text</p>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");

  html = `
    <p>Some \n text</p>\n\n\n
    <p>Some \n text</p>\n
    <p>Some \n text</p>
  `;
  expect(getHtmlClean(html)).toStrictEqual(
    "<p>Some text</p><p>Some text</p><p>Some text</p>"
  );

  html = `<p>Some         text</p>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p>Some text</p>         <p>Some text</p>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p><p>Some text</p>");

  html = `<p>Some text          </p>`;
  expect(getHtmlClean(html)).toStrictEqual("<p>Some text</p>");
});
