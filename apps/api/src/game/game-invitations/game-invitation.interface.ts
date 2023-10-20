import { z } from 'zod';

export const gameInvitationSchema = z.object({
  friendId: z.number().positive(),
  senderId: z.number().positive(),
});

export type GameInvitation = z.infer<typeof gameInvitationSchema>;
