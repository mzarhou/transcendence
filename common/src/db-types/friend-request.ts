import { User } from "./users";

export type FriendRequest = {
  id: number;
  requesterId: number;
  recipientId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FriendRequestWithRequester = {
  requester: User;
};

export type FriendRequestWithRecipient = {
  recipient: User;
};
