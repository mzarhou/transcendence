export * from "./friend-events";
export * from "./friend-request-events";
export * from "./group-events";
export * from "./message-events";
export * from "./game-events";

export const ERROR_EVENT = "exception";
export type WsErrorData = {
  message: string;
  statusCode?: number;
};
