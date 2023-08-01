export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  school42Id: number | null;
  isTfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  SentFriendRequests?: FriendRequest[];
  RecievedFriendRequests?: FriendRequest[];
  friends?: User[];
  blockedUsers?: User[];
  blockingUsers?: User[];
  sentMessages?: MessageType[];
  receivedMessages?: MessageType[];
  Notifications?: Notification[];
  groups?: Group[];
  blockingGroups?: Group[];
  ownGroups?: Group[];
  groupMessages?: GroupMessage[];
}

export type Notification = {
  id: number;
  event: string;
  data: any;
  recipientId: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  recipient?: User;
};

export type FriendRequest = {
  id: number;
  requesterId: number;
  recipientId?: number;
  createdAt: Date;
  updatedAt: Date;

  requester?: User;
  recipient?: User;
};

export type MessageType = {
  id: number;
  senderId: number;
  recipientId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  sender?: User;
  recipient?: User;
};

export enum UserGroupRole {
  ADMIN,
  MEMBER,
}

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

  users?: UserGroup[];
  owner?: User;
  messages?: GroupMessage[];
  blockedUsers?: User[];
};

export type GroupMessage = {
  id: number;
  senderId: number;
  groupId: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;

  sender?: User;
  group?: Group;
};
