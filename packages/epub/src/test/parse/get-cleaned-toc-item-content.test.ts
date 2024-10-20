import { expect, test } from "vitest";
import { getCleanedTocItemContent } from "../../lib/parse";

const getFilePath = (fileName?: string | null) => fileName ?? null;
const getFileBuffer = (fileName: string) => new Buffer(fileName);

const clean = (c: string) => {
  const res = getCleanedTocItemContent(getFilePath, getFileBuffer, [
    {
      name: "Test",
      src: "OEBPS/101.xhtml",
      path: "OEBPS/101.xhtml",
      id: null,
      html: c,
    },
  ]);

  return res[0]?.html;
};

test("unwrap <html> elements", () => {
  const html = `
    <html>
      <p>Some text
    </html>
  `;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("unwrap <body> elements", () => {
  const html = `
    <body>
      <p>Some text</p>
    </body>
  `;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("wrap elements with <p> tags", () => {
  const html = `Some text`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
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
    <label><p>Some text</p></label>
  `;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

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

test("remove spanning tags", () => {
  let html: string | null = null;

  html = `<p>Some <span>text</span></p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p>Some <a>text</a></p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<a>Some text</a>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<span>Some text</span>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("convert unnecessary text tags to <p> tags", () => {
  let html: string | null = null;

  html = `<h4>Some text</h4>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<h5>Some text</h5>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<h6>Some text</h6>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<pre>Some text</pre>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("prevent testing of <p> or text tags", () => {
  const html = `<p>Some<p>text</p></p>`;
  expect(clean(html)).toStrictEqual("<p>Some</p><p>text</p>");
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

test("remove empty tags that are not self-closing", () => {
  let html: string | null = null;

  html = `<p>Some <br /> text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some <br> text</p>");

  html = `<p>Some text</p> <br />`;
  expect(clean(html)).toStrictEqual("<p>Some text</p><br>");

  html = `<p>Some <hr /> text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some</p><hr><p>text</p>");

  html = `<p>Some text</p> <hr />`;
  expect(clean(html)).toStrictEqual("<p>Some text</p><hr>");

  html = `<p>Some text</p> <img />`;
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

test("handle random nested tags", () => {
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

test("remove newlines and extra spaces from the text", () => {
  let html: string | null = null;

  html = `<p>Some \n text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `
    <p>Some \n text</p>\n\n\n
    <p>Some \n text</p>\n
    <p>Some \n text</p>
  `;
  expect(clean(html)).toStrictEqual(
    "<p>Some text</p><p>Some text</p><p>Some text</p>"
  );

  html = `<p>Some         text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");

  html = `<p>Some text</p>         <p>Some text</p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p><p>Some text</p>");

  html = `<p>Some text          </p>`;
  expect(clean(html)).toStrictEqual("<p>Some text</p>");
});

test("replace image source with base64 or remove it", () => {
  let html: string | null = null;

  html = `<img>`;
  expect(clean(html)).toStrictEqual("");

  html = `<img src="dogs.jpg">`;
  expect(clean(html)).toStrictEqual(
    `<img src="data:image/jpeg;base64,ZG9ncy5qcGc=">`
  );

  html = `<img alt="dogs" src="dogs.jpg">`;
  expect(clean(html)).toStrictEqual(
    `<img alt="dogs" src="data:image/jpeg;base64,ZG9ncy5qcGc=">`
  );
});
