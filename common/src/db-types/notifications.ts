import { User } from "./users";

export type Notification = {
  id: number;
  event: string;
  data: any;
  recipientId: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationWithRecipient = {
  recipient: User;
};
