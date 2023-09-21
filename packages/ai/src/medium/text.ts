import { OpenAIChatModel, OpenAIChatMessage, generateText } from "modelfusion";

export const aiText = (conversation: OpenAIChatMessage[]) =>
  generateText(
    new OpenAIChatModel({
      model: "gpt-4",
      temperature: 0.7,
      maxCompletionTokens: 500,
    }),
    conversation
  );
