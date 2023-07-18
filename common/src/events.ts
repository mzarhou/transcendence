export const MESSAGE_EVENT = "message";
export const ERROR_EVENT = "ws_error";

export type WsErrorData = {
  message: string;
  statusCode?: number;
};
