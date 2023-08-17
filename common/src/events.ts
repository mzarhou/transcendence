export const MESSAGE_EVENT = "message";
export const MESSAGE_READ_EVENT = "message_read";

export const ERROR_EVENT = "ws_error";
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

export const FRIEND_REQUEST_EVENT = "friend_request";
export const FRIEND_REQUEST_ACCEPTED_EVENT = "friend_request_accepted";

/**
 * Group events
 */
export const GROUP_DELETED_EVENT = "group_deleted";
export const ADD_ADMIN_EVENT = "add_admin_event";
export const REMOVE_ADMIN_EVENT = "remove_admin_event";
export const GROUP_BANNED_EVENT = "group_banned_event";
export const GROUP_UNBANNED_EVENT = "group_unbanned_event";
export const GROUP_KICKED_EVENT = "group_kicked_event";
export const JOIN_GROUP_EVENT = "join_group_event";
export const LEAVE_GROUP_EVENT = "leave_group_event";
