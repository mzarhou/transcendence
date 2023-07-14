import z from "zod";

export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  school42Id: number;
  isTfaEnabled: boolean;
}

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
