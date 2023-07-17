import {
  OpenAIChatModel,
  OpenAIChatMessage,
  generateTextAsFunction,
} from "ai-utils.js";

interface SelectGenresOptions {
  genres: string[];
  title: string;
  author: string;
}

export const selectGenres = generateTextAsFunction(
  new OpenAIChatModel({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 500,
  }),
  // eslint-disable-next-line @typescript-eslint/require-await
  async ({ genres, title, author }: SelectGenresOptions) => [
    OpenAIChatMessage.system(
      `Given the following genres, please select the genres that fundamentally define ${title} by ${author} ${genres.join(
        ", "
      )} Please consider the main themes, narrative, character development, and the author's intent when choosing the genres. Only select a genre if removing it would significantly alter the book's identity or understanding:`
    ),
  ]
);
