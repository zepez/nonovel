import yauzl from "yauzl";

// Helper function to convert the event emitter to async iterable
export function getEntries(zipFile: yauzl.ZipFile): AsyncIterable<yauzl.Entry> {
  return {
    [Symbol.asyncIterator]: () => ({
      next: () =>
        new Promise((resolve, reject) => {
          const onEntry = (entry: yauzl.Entry) => {
            resolve({ value: entry, done: false });
            cleanup();
          };
          const onEnd = () => {
            resolve({ value: null, done: true });
            cleanup();
          };
          const onError = (error: Error) => {
            reject(error);
            cleanup();
          };
          const cleanup = () => {
            zipFile.off("entry", onEntry);
            zipFile.off("end", onEnd);
            zipFile.off("error", onError);
          };
          zipFile.readEntry();
          zipFile.once("entry", onEntry);
          zipFile.once("end", onEnd);
          zipFile.once("error", onError);
        }),
    }),
  };
}
