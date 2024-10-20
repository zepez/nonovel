import { Epub } from "./index";
import fs from "fs";

const main = async () => {
  // const book = "the-art-of-war";
  // const book = "the-great-gatsby";
  // const book = "the-war-of-the-worlds";
  // const book = "processed/the-art-of-war";
  // const book = "moby-dick";
  // const book = "romeo-and-juliet";
  // const book = "treasure-island";
  const book = "winnie-the-pooh";
  const filePath = `/Users/alex/Documents/nonovel/books/${book}.epub`;

  try {
    const epub = new Epub(filePath);
    await epub.read();
    epub.cleanedTocItemContent.forEach((t) => {
      fs.writeFileSync(__dirname + `/test/${t.id}.html`, t.html);
    });
  } catch (error) {
    console.error("Failed to read EPUB:", error);
  }
};

void main();
