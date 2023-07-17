import {
  OpenAIChatModel,
  OpenAIChatMessage,
  generateTextAsFunction,
} from "ai-utils.js";

interface GenerateSynopsisOptions {
  title: string;
  author: string;
}

export const generateSynopsis = generateTextAsFunction(
  new OpenAIChatModel({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 500,
  }),
  // eslint-disable-next-line @typescript-eslint/require-await
  async ({ title, author }: GenerateSynopsisOptions) => [
    OpenAIChatMessage.system(
      `Please generate a short, spoiler-free synopsis for ${title} by ${author}:`
    ),
  ]
);
