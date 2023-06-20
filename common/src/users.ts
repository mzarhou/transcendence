import z from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(4).optional(),
  avatar: z.string().url().optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
