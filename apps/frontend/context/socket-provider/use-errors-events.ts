import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ERROR_EVENT, WsErrorData } from "@transcendence/db";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../user-context";

export default function useErrorsEvents(socket: Socket) {
  const onError = useOnError();

  useEffect(() => {
    if (socket.hasListeners(ERROR_EVENT)) return;
    socket.on(ERROR_EVENT, async (data: WsErrorData) => onError(socket, data));
  }, []);
}

const useOnError = () => {
  const { toast } = useToast();
  const { user } = useUser();

  const onError = useCallback(
    async (_socket: Socket, data: WsErrorData) => {
      if (!user) return;
      if (data.statusCode !== 401) {
        toast({
          variant: "destructive",
          description: data.message,
        });
        return;
      }
    },
    [user]
  );
  return onError;
};
