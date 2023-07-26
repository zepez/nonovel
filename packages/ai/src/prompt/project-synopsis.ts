import { OpenAIChatMessage } from "ai-utils.js";
import { aiText } from "../medium";

export interface PromptSynopsisOptions {
  title: string;
  author: string;
}

export const promptProjectSynopsis = ({
  title,
  author,
}: PromptSynopsisOptions) => {
  return aiText([
    OpenAIChatMessage.system(
      `Please generate a short, spoiler-free synopsis for ${title} by ${author}`
    ),
  ]);
};
