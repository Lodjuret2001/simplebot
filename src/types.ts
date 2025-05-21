import { z } from "zod";

const TextMessageSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
});

const DemoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const DemoMessageSchema = z.object({
  type: z.literal("demo"),
  content: DemoSchema,
});

export type TextMessage = z.infer<typeof TextMessageSchema>;
export type Demo = z.infer<typeof DemoSchema>;
export type DemoMessage = z.infer<typeof DemoMessageSchema>;
export const AssistantResponseSchema = z.union([TextMessageSchema, DemoMessageSchema]);

export type BotProps = {
  apiKey: string;
  assistant: string;
  startMessage: string;
};

export type ChatBotMessage = {
  role: "assistant" | "user";
  message: TextMessage | DemoMessage;
};
