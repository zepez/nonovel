import yauzl from "yauzl";
import { getEntryData, getEntries } from ".";

export async function readEpub(
  filePath: string
): Promise<Record<string, Buffer>> {
  const fileContents: Record<string, Buffer> = {};

  const zipFile = await new Promise<yauzl.ZipFile>((resolve, reject) =>
    yauzl.open(filePath, { lazyEntries: true }, (err, zipFile) =>
      err ? reject(err) : resolve(zipFile)
    )
  );

  // Refactor to use for await...of syntax to correctly handle async event emitter
  for await (const entry of getEntries(zipFile)) {
    if (/\/$/.test(entry.fileName)) {
      // Skip directories
      continue;
    }

    const buffer = await getEntryData(zipFile, entry);
    fileContents[entry.fileName] = buffer;
  }

  return fileContents;
}
