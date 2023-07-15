import yauzl from "yauzl";

// Helper function to read the data from each entry
export function getEntryData(
  zipfile: yauzl.ZipFile,
  entry: yauzl.Entry
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err || !readStream) {
        reject(err);
        return;
      }

      const chunks: Buffer[] = [];
      const onData = (chunk: Buffer) => {
        chunks.push(chunk);
      };
      const onEnd = () => {
        resolve(Buffer.concat(chunks));
        cleanup();
      };
      const onError = (error: Error) => {
        reject(error);
        cleanup();
      };
      const cleanup = () => {
        readStream.off("data", onData);
        readStream.off("end", onEnd);
        readStream.off("error", onError);
      };
      readStream.on("data", onData);
      readStream.once("end", onEnd);
      readStream.once("error", onError);
    });
  });
}
