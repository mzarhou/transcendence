import { User } from "./users";

export type Notification = {
  id: number;
  event: string;
  data: unknown;
  recipientId: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationWithRecipient = {
  recipient: User;
};
