import * as path from "path";
import { readEpub } from "./lib/file";
import {
  getOpfPath,
  getOpfMetadata,
  getTocPath,
  getTocItems,
  getCompiledHtml,
  getTocItemContent,
  getCleanedTocItemContent,
} from "./lib/parse";
import { EpubMetadata, TocItem } from "./types";

export class Epub {
  private filePath: string;
  public fileContent: Record<string, Buffer>;

  public metaInfContent: string | null;
  public opfPath: string | null;
  public opfContent: string | null;
  public opfMetadata: EpubMetadata;
  public tocPath: string | null;
  public tocContent: string | null;
  public tocItems: TocItem<null>[];
  public compiledHtml: string;
  public tocItemContent: TocItem<string>[];
  public cleanedTocItemContent: TocItem<string>[];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.fileContent = {};

    this.metaInfContent = null;
    this.opfPath = null;
    this.opfContent = null;
    this.opfMetadata = {
      title: "",
      creator: "",
      cover: { path: null, buffer: null },
      publisher: null,
      description: null,
    };
    this.tocPath = null;
    this.tocContent = null;
    this.tocItems = [];
    this.compiledHtml = "";
    this.tocItemContent = [];
    this.cleanedTocItemContent = [];
  }

  public read = async () => {
    this.fileContent = await readEpub(this.filePath);
    this.metaInfContent = this.getFileStr("META-INF/container.xml");
    this.opfPath = getOpfPath(this.metaInfContent);
    this.opfContent = this.getFileStr(this.opfPath);
    this.opfMetadata = getOpfMetadata(
      this.getFilePath,
      this.getFileBuffer,
      this.opfContent
    );
    this.tocPath = getTocPath(this.getFilePath, this.opfContent);
    this.tocContent = this.getFileStr(this.tocPath);
    this.tocItems = getTocItems(this.getFilePath, this.tocContent);
    this.compiledHtml = getCompiledHtml(this.getFileStr, this.tocItems);
    this.tocItemContent = getTocItemContent(
      this.getFileStr,
      this.tocItems,
      this.compiledHtml
    );
    this.cleanedTocItemContent = getCleanedTocItemContent(
      this.getFilePath,
      this.getFileBuffer,
      this.tocItemContent
    );
  };

  public getFileBuffer = (fileName: string) => {
    return this.fileContent[fileName];
  };

  public getFileStr = (fileName: string) => {
    const file = this.getFileBuffer(fileName);
    if (!file) throw new Error(`Failed to get ${fileName}`);

    const content = file.toString().trim();
    if (content === "") throw new Error(`Failed to parse ${fileName}`);

    return content;
  };

  public getFilePath = (fileName?: string | null) => {
    if (!fileName || !this.opfPath) return null;

    return path.join(path.dirname(this.opfPath), fileName);
  };
}

export type TEpub = InstanceType<typeof Epub>;
