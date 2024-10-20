import { expect, test, assert } from "vitest";
import { getTocItems } from "../../lib/parse";

const goodTocContent = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx version="2005-1" xml:lang="en" xmlns="http://www.daisy.org/z3986/2005/ncx/">
  <head>
    <!-- The following four metadata items are required for all NCX documents, including those conforming to the relaxed constraints of OPS 2.0 -->

    <meta name="dtb:uid" content="d7a46450-1940-11e7-aeb0-4c72b9252ec6"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>

  <docTitle>
    <text>The Art of War</text>
  </docTitle>

  <docAuthor>
    <text>Sun Tzu</text>
  </docAuthor>

  <navMap>
    <navPoint class="titlepage" id="level1-titlepage" playOrder="1">
      <navLabel><text>Title</text></navLabel>
      <content src="title.xml"/>
    </navPoint>

    <navPoint class="about" id="level1-about" playOrder="2">
      <navLabel><text>About</text></navLabel>
      <content src="about.xml"/>
    </navPoint>

    <navPoint class="section" id="sec171963" playOrder="3">
      <navLabel><text>Publisher&#39;s Foreword</text></navLabel>
      <content src="main1.xml"/>
    </navPoint>

    <navPoint class="section" id="sec171966" playOrder="4">
      <navLabel><text>Introduction</text></navLabel>
      <content src="main2.xml"/>
    </navPoint>

    <navPoint class="chapter" id="chap171968" playOrder="5">
      <navLabel><text>Chapter 1 - Laying Plans</text></navLabel>
      <content src="main3.xml#xyz"/>
    </navPoint>
  </navMap>
</ncx>
`;

const getFilePath = (fileName?: string | null) => fileName ?? null;

test("throws when toc is missing or malformed", () => {
  expect(() => getTocItems(getFilePath, "")).toThrowError(
    "TOC content is empty or malformed"
  );
});

test("returns the correct amount of TOC items", () => {
  const toc = getTocItems(getFilePath, goodTocContent);
  expect(toc.length).toBe(5);
});

test("returns an array", () => {
  const toc = getTocItems(getFilePath, goodTocContent);
  assert.isArray(toc, "toc is array");
});

test("returns the correct TOC items", () => {
  const toc = getTocItems(getFilePath, goodTocContent);

  expect(toc[0]).toEqual({
    name: "Title",
    src: "title.xml",
    path: "title.xml",
    id: null,
    html: null,
  });
});

test("always returns empty html", () => {
  const toc = getTocItems(getFilePath, goodTocContent);

  toc.forEach((item) => {
    expect(item.html).toBeNull();
  });
});

test("returns the correct TOC id when present", () => {
  const toc = getTocItems(getFilePath, goodTocContent);

  expect(toc[4]).toEqual({
    name: "Chapter 1 - Laying Plans",
    src: "main3.xml#xyz",
    path: "main3.xml",
    id: "xyz",
    html: null,
  });
});
