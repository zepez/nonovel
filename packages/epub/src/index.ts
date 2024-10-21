import * as path from "path";
import { readEpub } from "./lib/file";
import {
  getPackagePath,
  getPackageMetadata,
  getHtmlDirty,
  getHtmlClean,
  getTocPath,
  getTocItems,
  getTocItemsDirty,
  getTocItemsClean,
} from "./lib/parse";
import { EpubMetadata, TocItem } from "./types";

export class Epub {
  public zip: {
    path: string;
    content: Record<string, Buffer> | null;
  };

  public root: {
    path: string;
    content: string | null;
  };

  public package: {
    path: string | null;
    content: string | null;
    metadata: EpubMetadata | null;
  };

  public html: {
    dirty: string | null;
    clean: string | null;
  };

  public toc: {
    path: string | null;
    content: string | null;
    items: TocItem<null>[] | null;
    dirtyItems: TocItem<string>[] | null;
    cleanItems: TocItem<string>[] | null;
  };

  constructor(zipPath: string) {
    this.zip = { path: zipPath, content: null };
    this.root = { path: "META-INF/container.xml", content: null };
    this.package = { path: null, content: null, metadata: null };
    this.html = { dirty: null, clean: null };
    this.toc = {
      path: null,
      content: null,
      items: null,
      dirtyItems: null,
      cleanItems: null,
    };
  }

  public read = async () => {
    this.zip.content = await readEpub(this.zip.path);
    this.root.content = this.getFileStr(this.root.path);
    this.package.path = getPackagePath(this.root.content);
    this.package.content = this.getFileStr(this.package.path);
    this.package.metadata = getPackageMetadata(
      this.getFilePath,
      this.getFileBuffer,
      this.package.content
    );
    this.toc.path = getTocPath(this.getFilePath, this.package.content);
    this.toc.content = this.getFileStr(this.toc.path);
    this.toc.items = getTocItems(this.getFilePath, this.toc.content);
    this.html.dirty = getHtmlDirty(this.getFileStr, this.toc.items);
    this.html.clean = getHtmlClean(this.html.dirty);
    this.toc.dirtyItems = getTocItemsDirty(
      this.getFileStr,
      this.toc.items,
      this.html.clean
    );
    this.toc.cleanItems = getTocItemsClean(
      this.getFilePath,
      this.getFileBuffer,
      this.toc.dirtyItems,
      this.package.metadata
    );
  };

  public getFileBuffer = (fileName: string) => {
    if (!this.zip.content) return null;
    return this.zip.content[fileName] ?? null;
  };

  public getFileStr = (fileName: string) => {
    const file = this.getFileBuffer(fileName);
    if (!file) throw new Error(`Failed to get ${fileName}`);

    const content = file.toString().trim();
    if (content === "") throw new Error(`Failed to parse ${fileName}`);

    return content;
  };

  public getFilePath = (fileName?: string | null) => {
    if (!fileName || !this.package.path) return null;

    return path.join(path.dirname(this.package.path), fileName);
  };
}

export type TEpub = InstanceType<typeof Epub>;
