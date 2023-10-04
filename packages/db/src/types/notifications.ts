import { Notifications, User } from "@prisma/client";
import { Prettify } from "../utils";

export type Notification = Prettify<
  Omit<Notifications, "data"> & { data: unknown }
>;

export type NotificationWithRecipient = {
  recipient: User;
};
