import z from "zod";

export const createFriendRequestSchema = z.object({
  targetUserId: z.number().positive(),
});
export type CreateFriendRequestType = z.infer<typeof createFriendRequestSchema>;

export const searchSchema = z.object({
  term: z.string().min(3),
});
export type SearchType = z.infer<typeof searchSchema>;
