import z from "zod";

export const searchSchema = z.object({
  term: z.string(),
});
export type SearchType = z.infer<typeof searchSchema>;

export const createFriendRequestSchema = z.object({
  targetUserId: z.number().positive(),
});
export type CreateFriendRequestType = z.infer<typeof createFriendRequestSchema>;

export const sendMessageSchema = z.object({
  recipientId: z.number().positive(),
  message: z.string().min(1),
});
export type SendMessageType = z.infer<typeof sendMessageSchema>;
