import z from "zod";
import { User } from "./db-types";

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
