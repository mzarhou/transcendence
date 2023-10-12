import { User } from "@prisma/client";

export type FriendRequestWithRequester = {
  requester: User;
};

export type FriendRequestWithRecipient = {
  recipient: User;
};
