import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ERROR_EVENT, WsErrorData } from "@transcendence/db";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export default function useErrorsEvents(socket: Socket) {
  const onError = useOnError();

  useEffect(() => {
    if (socket.hasListeners(ERROR_EVENT)) return;
    socket.on(ERROR_EVENT, async (data: WsErrorData) => onError(socket, data));
  }, []);
}

const useOnError = () => {
  const { toast } = useToast();

  const onError = useCallback(async (socket: Socket, data: WsErrorData) => {
    if (data.statusCode !== 401) {
      toast({
        variant: "destructive",
        description: data.message,
      });
      return;
    }
    try {
      // try to refresh tokens
      await api.post("/authentication/refresh-tokens");
      setTimeout(() => {
        socket.connect();
      }, 200);
    } catch (error) {}
  }, []);
  return onError;
};
