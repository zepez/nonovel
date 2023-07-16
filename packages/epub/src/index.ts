import * as path from "path";
import { readEpub } from "./lib/file";
import {
  getMetaInfContent,
  getOpfPath,
  getOpfContent,
  getOpfMetadata,
  getTocPath,
  getTocContent,
  getTocItems,
  getCompiledHtml,
  getTocItemContent,
  getCleanedTocItemContent,
} from "./lib/parse";

interface EpubMetadata {
  title: string;
  creator: string;
  cover: string | null;
}

interface TocItem<T> {
  name: string;
  src: string;
  file: string;
  id: string | null;
  html: T;
}

export class Epub {
  private filePath: string;
  public fileContent: Record<string, Buffer>;

  public metaInfContent: string;
  public getMetaInfContent: () => string;

  public opfPath: string;
  public getOpfPath: () => string;

  public opfContent: string;
  public getOpfContent: () => string;

  public opfMetadata: EpubMetadata;
  public getOpfMetadata: () => EpubMetadata;

  public tocPath: string;
  public getTocPath: () => string;

  public tocContent: string;
  public getTocContent: () => string;

  public tocItems: TocItem<null>[];
  public getTocItems: () => TocItem<null>[];

  public compiledHtml: string;
  public getCompiledHtml: () => string;

  public tocItemContent: TocItem<string>[];
  public getTocItemContent: () => TocItem<string>[];

  public cleanedTocItemContent: TocItem<string>[];
  public getCleanedTocItemContent: () => TocItem<string>[];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.fileContent = {};

    this.metaInfContent = "";
    this.getMetaInfContent = getMetaInfContent.bind(this);

    this.opfPath = "";
    this.getOpfPath = getOpfPath.bind(this);

    this.opfContent = "";
    this.getOpfContent = getOpfContent.bind(this);

    this.opfMetadata = { title: "", creator: "", cover: null };
    this.getOpfMetadata = getOpfMetadata.bind(this);

    this.tocPath = "";
    this.getTocPath = getTocPath.bind(this);

    this.tocContent = "";
    this.getTocContent = getTocContent.bind(this);

    this.tocItems = [];
    this.getTocItems = getTocItems.bind(this);

    this.compiledHtml = "";
    this.getCompiledHtml = getCompiledHtml.bind(this);

    this.tocItemContent = [];
    this.getTocItemContent = getTocItemContent.bind(this);

    this.cleanedTocItemContent = [];
    this.getCleanedTocItemContent = getCleanedTocItemContent.bind(this);
  }

  public read = async () => {
    this.fileContent = await readEpub(this.filePath);
    this.metaInfContent = this.getMetaInfContent();
    this.opfPath = this.getOpfPath();
    this.opfContent = this.getOpfContent();
    this.opfMetadata = this.getOpfMetadata();
    this.tocPath = this.getTocPath();
    this.tocContent = this.getTocContent();
    this.tocItems = this.getTocItems();
    this.compiledHtml = this.getCompiledHtml();
    this.tocItemContent = this.getTocItemContent();
    this.cleanedTocItemContent = this.getCleanedTocItemContent();
  };

  public get = (fileName: string) => {
    return this.fileContent[fileName];
  };

  public getPath = (fileName?: string | null) => {
    if (!fileName) return null;

    return path.join(path.dirname(this.opfPath), fileName);
  };
}

export type TEpub = InstanceType<typeof Epub>;

// const main = async () => {
//   // const book = "the-art-of-war";
//   // const book = "the-great-gatsby";
//   // const book = "the-war-of-the-worlds";
//   // const book = "war-and-peace";
//   // const book = "moby-dick";
//   const book = "romeo-and-juliet";
//   const filePath = `/Users/alex/Documents/nonovel/books/${book}.epub`;

//   try {
//     const epub = new Epub(filePath);
//     await epub.read();
//     // console.log(epub.tocItemContent[4]);
//     console.log(epub.cleanedTocItemContent[3]);
//   } catch (error) {
//     console.error("Failed to read EPUB:", error);
//   }
// };

// void main();
