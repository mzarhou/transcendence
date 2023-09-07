import z from "zod";
import { Group, UserGroupRole } from "./db-types";

const errorMessage =
  "You must provide a password when setting status to `PROTECTED`";

export const baseCreateGroupSchema = z.object({
  name: z.string().min(3),
  status: z.enum(["PUBLIC", "PROTECTED", "PRIVATE"]),
  password: z.string().min(8).optional(),
});

export const createGroupSchema = baseCreateGroupSchema.refine(
  (data) => data.status !== "PROTECTED" || data.password !== undefined,
  errorMessage,
);
export type CreateGroupType = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = baseCreateGroupSchema.partial();
//   .refine(
//     (data) => data.status !== "PROTECTED" || data.password !== undefined,
//     errorMessage
//   );
export type UpdateGroupType = z.infer<typeof updateGroupSchema>;

export const addGroupAdminSchema = z.object({
  userId: z.number().positive(),
});
export type AddGroupAdminType = z.infer<typeof addGroupAdminSchema>;

export const removeGroupAdminSchema = addGroupAdminSchema;
export type RemoveGroupAdminType = z.infer<typeof removeGroupAdminSchema>;

export const banUserSchema = addGroupAdminSchema;
export type BanUserType = z.infer<typeof banUserSchema>;

export const unBanUserSchema = banUserSchema;
export type UnBanUserType = z.infer<typeof unBanUserSchema>;

export const kickUserSchema = banUserSchema;
export type KickUserType = z.infer<typeof kickUserSchema>;

export const joinGroupSchema = z.object({
  password: z.string().optional(),
});
export type JoinGroupType = z.infer<typeof joinGroupSchema>;

export const ownerLeaveGroupSchema = z.object({
  newOwnerId: z.number().positive(),
});
export type OwnerLeaveGroupType = z.infer<typeof ownerLeaveGroupSchema>;

export type GroupWithRole = Group & { role: UserGroupRole };
export type SearchGroup = Group & { role: UserGroupRole | undefined };

export const groupUsersFilterSchema = z.object({
  filter: z.enum(["admins", "members", "banned"]),
});
export type GroupUsersFilter = z.infer<typeof groupUsersFilterSchema>;

export const sendGroupMessageSchema = z.object({
  groupId: z.number().positive(),
  message: z.string().min(1).max(2000),
});
export type SendGroupMessageType = z.infer<typeof sendGroupMessageSchema>;

export const muteUserSchema = z.object({
  userId: z.number().positive(),
  period: z
    .number()
    .positive()
    .min(10)
    .max(86400)
    .describe("period in seconds, 10 - 86400 (24h)"),
});
export type MuteUserType = z.infer<typeof muteUserSchema>;
