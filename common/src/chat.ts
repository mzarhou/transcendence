import z from "zod";

export const createFriendRequestSchema = z.object({
  targetUserId: z.number().positive(),
});

export type CreateFriendRequestType = z.infer<typeof createFriendRequestSchema>;
