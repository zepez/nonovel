import { promptProjectKnowledge, promptProjectSynopsis } from "../prompt";

export interface ChainProjectSynopsisOptions {
  title: string;
  author: string;
}

export const chainProjectSynopsis = async ({
  title,
  author,
}: ChainProjectSynopsisOptions) => {
  try {
    const knowledgeString = await promptProjectKnowledge({ title, author });

    const knowledge = knowledgeString.toLowerCase() === "true";
    if (!knowledge)
      throw new Error(
        `Can not generate synopsis. Not enough information known about ${title} by ${author}.`
      );

    const synopsis = await promptProjectSynopsis({ title, author });
    return synopsis;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    return null;
  }
};
