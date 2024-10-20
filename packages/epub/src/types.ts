export interface EpubMetadata {
  title: string;
  creator: string;
  cover: { path: string | null; buffer: Buffer | null };
  publisher: string | null;
  description: string | null;
}

export interface TocItem<T> {
  name: string;
  src: string;
  path: string;
  id: string | null;
  html: T;
}
