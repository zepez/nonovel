import {
  promptProjectKnowledge,
  promptProjectCoverKnown,
  promptProjectCoverUnknown,
} from "../prompt";

export interface ChainProjectCoverOptions {
  title: string;
  author: string;
}

export const chainProjectCover = async ({
  title,
  author,
}: ChainProjectCoverOptions) => {
  try {
    const knowledgeString = await promptProjectKnowledge({ title, author });

    const knowledge = knowledgeString.toLowerCase() === "true";

    if (knowledge) {
      return await promptProjectCoverKnown({ title, author });
    } else {
      return await promptProjectCoverUnknown();
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    return null;
  }
};
