import yauzl from "yauzl";
import { getEntryData, getEntries } from ".";

export async function readEpub(
  filePath: string
): Promise<Record<string, Buffer>> {
  const fileContents: Record<string, Buffer> = {};

  const zipfile = await new Promise<yauzl.ZipFile>((resolve, reject) =>
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) =>
      err ? reject(err) : resolve(zipfile)
    )
  );

  // Refactor to use for await...of syntax to correctly handle async event emitter
  for await (const entry of getEntries(zipfile)) {
    if (/\/$/.test(entry.fileName)) {
      // Skip directories
      continue;
    }

    const buffer = await getEntryData(zipfile, entry);
    fileContents[entry.fileName] = buffer;
  }

  return fileContents;
}
