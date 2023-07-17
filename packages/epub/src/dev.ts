import { Epub } from "./index";

const main = async () => {
  // const book = "the-art-of-war";
  // const book = "the-great-gatsby";
  // const book = "the-war-of-the-worlds";
  // const book = "war-and-peace";
  // const book = "moby-dick";
  const book = "romeo-and-juliet";
  const filePath = `/Users/alex/Documents/nonovel/books/${book}.epub`;

  try {
    const epub = new Epub(filePath);
    await epub.read();
    // console.log(epub.tocItemContent[4]);
    console.log(epub.cleanedTocItemContent[3]);
  } catch (error) {
    console.error("Failed to read EPUB:", error);
  }
};

void main();
