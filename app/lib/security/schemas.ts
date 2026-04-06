import { z } from "zod"

const MAX_MESSAGES = 30
const MAX_MESSAGE_LENGTH = 2000

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
})

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .transform(msgs => msgs.slice(-MAX_MESSAGES)),
  turnstileToken: z.string().optional(),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>
