import { User } from "./users";

export type MessageType = {
  id: number;
  senderId: number;
  recipientId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MessageWithSender = {
  sender: User;
};

export type MessageWithRecipient = {
  recipient: User;
};
