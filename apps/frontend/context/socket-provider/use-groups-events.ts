import { Socket } from "socket.io-client";
import { useUser } from "../user-context";
import { useEffect } from "react";
import {
  ADD_ADMIN_NOTIFICATION,
  GROUP_BANNED_NOTIFICATION,
  GROUP_DELETED_NOTIFICATION,
  GROUP_INVITATION_NOTIFICATION,
  GROUP_KICKED_NOTIFICATION,
  GROUP_MESSAGE_EVENT,
  GROUP_NOTIFICATION_PAYLOAD,
  GROUP_UNBANNED_NOTIFICATION,
  GROUP_USER_CONNECTED_EVENT,
  GROUP_USER_DISCONNECTED_EVENT,
  GroupMessage,
  GroupMessageWithSender,
  GroupUserConnectedData,
  JOIN_GROUP_NOTIFICATION,
  LEAVE_GROUP_NOTIFICATION,
  REMOVE_ADMIN_NOTIFICATION,
} from "@transcendence/db";
import { notificationsKey } from "@/api-hooks/notifications/use-notifications";
import { useSWRConfig } from "swr";
import { groupsKey } from "@/api-hooks/groups/use-groups";
import { groupKey } from "@/api-hooks/groups/use-group";
import { getGroupMessagesKey } from "@/api-hooks/groups/use-group-messages";

export function useGroupEvents(socket: Socket) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    socket.on("connect", () => {
      if (socket.hasListeners(GROUP_DELETED_NOTIFICATION)) return;
      console.log("setup groups events");
      [
        GROUP_DELETED_NOTIFICATION,
        ADD_ADMIN_NOTIFICATION,
        REMOVE_ADMIN_NOTIFICATION,
        GROUP_BANNED_NOTIFICATION,
        GROUP_UNBANNED_NOTIFICATION,
        GROUP_KICKED_NOTIFICATION,
        JOIN_GROUP_NOTIFICATION,
        LEAVE_GROUP_NOTIFICATION,
        GROUP_INVITATION_NOTIFICATION,
      ].forEach((event) => {
        socket.on(event, (_data: GROUP_NOTIFICATION_PAYLOAD) => {
          mutate(notificationsKey);
        });
      });

      socket.on(
        GROUP_DELETED_NOTIFICATION,
        (_data: GROUP_NOTIFICATION_PAYLOAD) => {
          mutate(groupsKey);
        }
      );

      [GROUP_USER_CONNECTED_EVENT, GROUP_USER_DISCONNECTED_EVENT].forEach(
        (event) => {
          socket.on(event, (data: GroupUserConnectedData) => {
            mutate(groupKey(data.groupId + ""));
          });
        }
      );

      socket.on(
        GROUP_MESSAGE_EVENT,
        (message: GroupMessage & GroupMessageWithSender) => {
          mutate(
            getGroupMessagesKey(message.groupId.toString()),
            (data: any) => [...(data ?? []), message]
          );
        }
      );
    });
  }, []);
}
