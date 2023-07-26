import { OpenAIChatModel, OpenAIChatMessage, generateText } from "ai-utils.js";

export const aiText = (conversation: OpenAIChatMessage[]) =>
  generateText(
    new OpenAIChatModel({
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 500,
    }),
    conversation
  );
