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
  // const book = "winnie-the-pooh";
  const book = "treasure-island";
  const filePath = `/Users/alex/Documents/nonovel/books/${book}.epub`;

  try {
    const epub = new Epub(filePath);
    await epub.read();
    // console.log(epub.html.clean);
    // fs.writeFileSync(
    //   __dirname + ` /test/clean.html`,
    //   epub.html.clean as string
    // );
    // if (epub.toc.cleanItems) {
    //   epub.toc.cleanItems.forEach((t) => {
    //     fs.writeFileSync(__dirname + `/test/${t.id}_${t.name}.html`, t.html);
    //   });
    // }
  } catch (error) {
    console.error("Failed to read EPUB:", error);
  }
};

void main();
