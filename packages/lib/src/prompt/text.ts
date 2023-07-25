import { OpenAIChatModel, OpenAIChatMessage, generateText } from "ai-utils.js";

export const promptText = (prompt: string) =>
  generateText(
    new OpenAIChatModel({
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 500,
    }),
    [OpenAIChatMessage.system(prompt)]
  );
