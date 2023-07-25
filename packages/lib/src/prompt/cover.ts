import { aiImage } from "../ai";

export interface PromptCoverOptions {
  title: string;
  author: string;
}

export const promptCover = ({ title, author }: PromptCoverOptions) => {
  return aiImage([
    {
      text: `beautiful book illustration, ${title}, ${author}`,
      weight: 1,
    },
  ]);
};
