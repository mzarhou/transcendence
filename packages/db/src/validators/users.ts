import { User } from "@prisma/client";
import z from "zod";

export type SearchUser = User & {
  isFriend: boolean;
  sentFrId: number | null;
  receivedFrId: number | null;
};

export const updateUserSchema = z.object({
  name: z.string().min(4).optional(),
  avatar: z.string().url().optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
