import { aiImage } from "../medium";

export interface PromptCoverOptions {
  title: string;
  author: string;
}

export const promptProjectCoverKnown = ({
  title,
  author,
}: PromptCoverOptions) => {
  return aiImage("digital-art", [
    {
      text: `beautiful book illustration, ${title}, ${author}, style of Willem van Aelst, vibrant colors`,
      weight: 1,
    },
  ]);
};
