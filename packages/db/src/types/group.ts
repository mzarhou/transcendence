import { Group, GroupMessage, User, UserGroupRole } from "@prisma/client";

export type UserGroup = User & { role: UserGroupRole };

export type GroupWithoutPassword = Omit<Group, "password">;

export type GroupWithUsers = {
  users: UserGroup[];
};

export type GroupWithOwner = {
  owner: User;
};

export type GroupWithMessages = {
  messages: GroupMessage[];
};

export type GroupWithBlockedUsers = {
  blockedUsers: User[];
};

export type GroupMessageWithSender = {
  sender: User;
};
