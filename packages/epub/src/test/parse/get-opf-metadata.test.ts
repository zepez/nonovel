import { expect, test } from "vitest";
import { getOpfMetadata } from "../../lib/parse";

const goodOpfContent = `
  <?xml version="1.0" encoding="UTF-8" ?>
    <package version="2.0" unique-identifier="PrimaryID" xmlns="http://www.idpf.org/2007/opf">
      <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dcterms="http://purl.org/dc/terms/">
        <dc:title>The Art of War</dc:title>
        <dc:language xsi:type="dcterms:RFC4646">en</dc:language>
        <dc:creator opf:role="aut" opf:file-as="Sun Tzu">Sun Tzu</dc:creator>
        <dc:publisher>Feedbooks</dc:publisher>
        <dc:description>The Art of War is a Chinese military treatise that was written during the 6th century BC by Sun Tzu. Composed of 13 chapters, each of which is devoted to one aspect of warfare, it has long been praised as the definitive work on military strategies and tactics of its time. The Art of War is one of the oldest books on military strategy in the world. It is the first and one of the most successful works on strategy and has had a huge influence on Eastern and Western military thinking, business tactics, and beyond. Sun Tzu was the first to recognize the importance of positioning in strategy and that position is affected both by objective conditions in the physical environment and the subjective opinions of competitive actors in that environment. He taught that strategy was not planning in the sense of working through a to-do list, but rather that it requires quick and appropriate responses to changing conditions. Planning works in a controlled environment, but in a competitive environment,</dc:description>
        <dc:subject>Non-Fiction</dc:subject>
        <dc:subject>Human Science</dc:subject>
        <dc:subject>Philosophy</dc:subject>

        <meta name="cover" content="book-cover"/>
      </metadata>

      <manifest>
        <item id="book-cover"
          href="images/cover.png"
          media-type="image/png"/>
      </manifest>
    </package>
  </xml>
`;

const minimalOpfContent = `
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dcterms="http://purl.org/dc/terms/">
    <dc:title>The Art of War</dc:title>
    <dc:creator opf:role="aut" opf:file-as="Sun Tzu">Sun Tzu</dc:creator>
    <meta name="cover" content="book-cover"/>
  </metadata>
`;

const noMetaOpfContent = `<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dcterms="http://purl.org/dc/terms/"></metadata>`;

const noTitleOpfContent = `
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dcterms="http://purl.org/dc/terms/">
    <dc:creator opf:role="aut" opf:file-as="Sun Tzu">Sun Tzu</dc:creator>
  </metadata>
`;

const noCreatorOpfContent = `
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dcterms="http://purl.org/dc/terms/">
    <dc:title>The Art of War</dc:title>
  </metadata>
`;

const getFilePath = (fileName?: string | null) => fileName ?? null;
const getFileBuffer = (fileName: string) => new Buffer(fileName);

test("throws when metadata is missing or malformed", () => {
  expect(() => getOpfMetadata(getFilePath, getFileBuffer, "")).toThrowError(
    "Failed to get metadata"
  );

  expect(() =>
    getOpfMetadata(getFilePath, getFileBuffer, noMetaOpfContent)
  ).toThrowError("Failed to get metadata");
});

test("throws when title is not found", () => {
  expect(() =>
    getOpfMetadata(getFilePath, getFileBuffer, noTitleOpfContent)
  ).toThrowError("Failed to get title");
});

test("throws when creator is not found", () => {
  expect(() =>
    getOpfMetadata(getFilePath, getFileBuffer, noCreatorOpfContent)
  ).toThrowError("Failed to get creator");
});

test("returns object with with the correct shape", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);

  expect(goodMeta).toHaveProperty("cover");
  expect(goodMeta).toHaveProperty("cover.path");
  expect(goodMeta).toHaveProperty("cover.buffer");
  expect(goodMeta).toHaveProperty("creator");
  expect(goodMeta).toHaveProperty("title");
  expect(goodMeta).toHaveProperty("publisher");
  expect(goodMeta).toHaveProperty("description");

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta).toHaveProperty("cover");
  expect(minMeta).toHaveProperty("cover.path");
  expect(minMeta).toHaveProperty("cover.buffer");
  expect(minMeta).toHaveProperty("creator");
  expect(minMeta).toHaveProperty("title");
  expect(minMeta).toHaveProperty("publisher");
  expect(minMeta).toHaveProperty("description");
});

test("returns with the correct creator value", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);
  expect(goodMeta.creator).toBe("Sun Tzu");

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta.creator).toBe("Sun Tzu");
});

test("returns with the correct title value", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);
  expect(goodMeta.title).toBe("The Art of War");

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta.title).toBe("The Art of War");
});

test("returns with the correct cover path", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);
  expect(goodMeta.cover.path).toBe("images/cover.png");

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta.cover.path).toBe(null);
});

test("returns with the correct cover buffer", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);
  expect(goodMeta.cover.buffer).toStrictEqual(new Buffer("images/cover.png"));

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta.cover.buffer).toStrictEqual(null);
});

test("returns with the correct publisher", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);
  expect(goodMeta.publisher).toBe("Feedbooks");

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta.publisher).toBe(null);
});

test("returns with the correct description", () => {
  const goodMeta = getOpfMetadata(getFilePath, getFileBuffer, goodOpfContent);
  expect(goodMeta.description).toBe(
    `The Art of War is a Chinese military treatise that was written during the 6th century BC by Sun Tzu. Composed of 13 chapters, each of which is devoted to one aspect of warfare, it has long been praised as the definitive work on military strategies and tactics of its time. The Art of War is one of the oldest books on military strategy in the world. It is the first and one of the most successful works on strategy and has had a huge influence on Eastern and Western military thinking, business tactics, and beyond. Sun Tzu was the first to recognize the importance of positioning in strategy and that position is affected both by objective conditions in the physical environment and the subjective opinions of competitive actors in that environment. He taught that strategy was not planning in the sense of working through a to-do list, but rather that it requires quick and appropriate responses to changing conditions. Planning works in a controlled environment, but in a competitive environment,`
  );

  const minMeta = getOpfMetadata(getFilePath, getFileBuffer, minimalOpfContent);
  expect(minMeta.description).toBe(null);
});
