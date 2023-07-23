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

export type Notification = {
  id: number;
  event: string;
  data: any;
  recipientId: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FriendRequest = {
  id: number;
  requester?: User;
  requesterId: number;
  recipient?: User;
  recipientId?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MessageType = {
  id: number;
  senderId: number;
  recipientId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};
