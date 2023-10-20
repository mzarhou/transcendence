import { z } from "zod";

export const createGameInivationSchema = z.object({
  friendId: z.number().positive(),
});

export type CreateGameInvitationType = z.infer<
  typeof createGameInivationSchema
>;
