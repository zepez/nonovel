import { OpenAIChatMessage } from "modelfusion";
import { aiText } from "../medium";

export interface PromptProjectKnowledge {
  title: string;
  author: string;
}

export const promptProjectKnowledge = ({
  title,
  author,
}: PromptProjectKnowledge) => {
  return aiText([
    OpenAIChatMessage.system(
      "You will be provided a book name and author name. If you know enough about the book to write a short synopsis, please respond with true. If you do not, please respond with false. Do not respond with anything else, other than true or false."
    ),
    OpenAIChatMessage.assistant(
      "Understood. Please provide the book title and author name."
    ),
    OpenAIChatMessage.user(`Book: ${title} by ${author}`),
  ]);
};
