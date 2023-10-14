/**
 * Notifications
 */
export const GROUP_DELETED_NOTIFICATION = "group_deleted";
export const ADD_ADMIN_NOTIFICATION = "add_admin_event";
export const REMOVE_ADMIN_NOTIFICATION = "remove_admin_event";
export const GROUP_BANNED_NOTIFICATION = "group_banned_event";
export const GROUP_UNBANNED_NOTIFICATION = "group_unbanned_event";
export const GROUP_KICKED_NOTIFICATION = "group_kicked_event";
export const JOIN_GROUP_NOTIFICATION = "join_group_event";
export const LEAVE_GROUP_NOTIFICATION = "leave_group_event";
export const GROUP_INVITATION_NOTIFICATION = "new_group_invitation";
export type GROUP_NOTIFICATION_PAYLOAD = {
  message: string;
  groupId: number;
};

/**
 * Events
 */
export const GROUP_MESSAGE_EVENT = "group_message";

export const GROUP_USER_CONNECTED_EVENT = "group_user_connected";
export type GroupUserConnectedData = {
  userId: number;
  groupId: number;
};

export const GROUP_USER_DISCONNECTED_EVENT = "group_user_disconnected";
export type GroupUserDisconnectedData = GroupUserConnectedData;
