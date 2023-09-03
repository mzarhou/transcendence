export const MESSAGE_EVENT = "message";
export const MESSAGE_READ_EVENT = "message_read";

export const ERROR_EVENT = "exception";
export type WsErrorData = {
  message: string;
  statusCode?: number;
};

export const FRIEND_CONNECTED = "friend_connected";
export type FriendConnectedData = {
  friendId: number;
};

export const FRIEND_DISCONNECTED = "friend_disconnected";
export type FriendDisconnectedData = FriendConnectedData;

/**
 * notifications events
 */
export const FRIEND_REQUEST_EVENT = "friend_request";
export const FRIEND_REQUEST_ACCEPTED_EVENT = "friend_request_accepted";

/**
 * payload for this events is string (notification message)
 */
export const GROUP_DELETED_NOTIFICATION = "group_deleted";
export const ADD_ADMIN_NOTIFICATION = "add_admin_event";
export const REMOVE_ADMIN_NOTIFICATION = "remove_admin_event";
export const GROUP_BANNED_NOTIFICATION = "group_banned_event";
export const GROUP_UNBANNED_NOTIFICATION = "group_unbanned_event";
export const GROUP_KICKED_NOTIFICATION = "group_kicked_event";
export const JOIN_GROUP_NOTIFICATION = "join_group_event";
export const LEAVE_GROUP_NOTIFICATION = "leave_group_event";
export type GROUP_NOTIFICATION_PAYLOAD = {
  message: string;
  groupId: number;
};

/**
 * Group events
 */
export const GROUP_MESSAGE_EVENT = "group_message";

export const GROUP_USER_CONNECTED_EVENT = "group_user_connected";
export type GroupUserConnectedData = {
  userId: number;
  groupId: number;
};

export const GROUP_USER_DISCONNECTED_EVENT = "group_user_disconnected";
export type GroupUserDisconnectedData = GroupUserConnectedData;
