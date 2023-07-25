import { aiText } from "../ai";

export interface PromptSynopsisOptions {
  title: string;
  author: string;
}

export const promptSynopsis = ({ title, author }: PromptSynopsisOptions) => {
  return aiText(
    `Please generate a short, spoiler-free synopsis for ${title} by ${author}`
  );
};
