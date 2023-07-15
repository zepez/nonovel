import yauzl from "yauzl";

// Helper function to convert the event emitter to async iterable
export function getEntries(zipfile: yauzl.ZipFile): AsyncIterable<yauzl.Entry> {
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
            zipfile.off("entry", onEntry);
            zipfile.off("end", onEnd);
            zipfile.off("error", onError);
          };
          zipfile.readEntry();
          zipfile.once("entry", onEntry);
          zipfile.once("end", onEnd);
          zipfile.once("error", onError);
        }),
    }),
  };
}
