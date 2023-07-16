import z, { Schema } from "zod";
import { User } from "./users";

export const searchSchema = z.object({
  term: z.string(),
});
export type SearchType = z.infer<typeof searchSchema>;

export const createFriendRequestSchema = z.object({
  targetUserId: z.number().positive(),
});
export type CreateFriendRequestType = z.infer<typeof createFriendRequestSchema>;

export type FriendRequest = {
  id: number;
  requester: User;
};

export const messageSchema = z.object({
  userId: z.number().positive(),
  message: z.string().min(1),
});
export type MessageType = z.infer<typeof messageSchema>;
