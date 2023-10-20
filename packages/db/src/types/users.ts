import type {
  FriendRequest,
  Group,
  GroupMessage,
  Message,
  Secrets,
  User,
} from "@prisma/client";
import { Prettify } from "../utils";

export type { User };

export type CurrentUser = Prettify<
  User & {
    isTfaCodeProvided: boolean;
    isFirstSignIn: boolean;
  }
>;

export interface UserWithSecrets {
  secrets: Secrets | null;
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
  receivedMessages: Message[];
}

export interface UserWithSentMessages {
  sentMessages: Message[];
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
