import { Message, User } from "@prisma/client";

export type MessageType = Message;

export type MessageWithSender = {
  sender: User;
};

export type MessageWithRecipient = {
  recipient: User;
};
