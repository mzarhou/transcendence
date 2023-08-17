import { User } from "./users";

export type UserGroupRole = "ADMIN" | "MEMBER";

export type UserGroup = User & { role: UserGroupRole };

export type GroupStatus = "PUBLIC" | "PROTECTED" | "PRIVATE";

export type Group = {
  id: number;
  name: string;
  avatar: string;
  ownerId: number;
  status: GroupStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type GroupWithPassword = Group & {
  password: string | null;
};

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

export type GroupMessage = {
  id: number;
  senderId: number;
  groupId: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GroupMessageWithSender = {
  sender: User;
};

export type GroupMessageWith = {
  group: Group;
};
