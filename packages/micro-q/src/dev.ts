import { qs } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await qs.genCover.add({
    projectId: "d9b1331f-0f70-41ab-942c-584d013350ce",
  });
  main();
};

void dev();
