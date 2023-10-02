import { FriendRequest } from "./friend-request";
import { Group, GroupMessage } from "./group";
import { MessageType } from "./message";
import { UserSecrets } from "./user-secrets";

export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  school42Id: number | null;
  isTfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CurrentUser = User & {
  isTfaCodeProvided: boolean;
};

export interface UserWithSecrets {
  secrets: UserSecrets | null;
}

export interface UserWithSentFriendRequests {
  SentFriendRequests: FriendRequest[];
}

export interface UserWithRecievedFriendRequests {
  RecievedFriendRequests: FriendRequest[];
}

export interface UserWithBlockedUsers {
  blockedUsers: User[];
}

export interface UserWithBlockingUsers {
  blockingUsers: User[];
}

export interface UserWithReceivedMessages {
  receivedMessages: MessageType[];
}

export interface UserWithSentMessages {
  sentMessages: MessageType[];
}

export interface UserWithFriends {
  friends: User[];
}

export interface UserWithGroups {
  groups: Group[];
}

export interface UserWithBlockingGroups {
  blockingGroups: Group[];
}

export interface UserWithOwnGroups {
  ownGroups: Group[];
}

export interface UserWithGroupMessages {
  groupMessages: GroupMessage[];
}

export interface UserWithNotifications {
  Notifications: Notification[];
}
