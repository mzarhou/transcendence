import { Socket } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
import {
  EventGame,
  ballEntity,
  player1,
  player2,
  states,
  status,
} from "../entity/entity";

interface match {
  matchId: number;
  homeId: number;
  adversaryId: number;
  winnerId: number | null;
}

export let match: match = {
  matchId: 0,
  homeId: 0,
  adversaryId: 0,
  winnerId: null,
};

export function PlayerPosition(direction: string): boolean {
  const [arrowDirection, setArrowDirection] = useState(false);
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === direction) {
        setArrowDirection(true);
      }
    },
    [direction]
  );

  const handleKeyUp = useCallback(() => {
    setArrowDirection(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  return arrowDirection;
}

export const socketEventListener = async (socket: Socket | null) => {
  if (socket) {
    if (!socket.hasListeners(EventGame.MCHFOUND)) {
      socket.on(EventGame.MCHFOUND, (data) => {
        match = data.match;
        player1.nmPl = match.homeId;
        player2.nmPl = match.adversaryId;
        console.log("matchId: " + match.matchId + "\n");
        console.log("matchId: " + match.homeId + "\n");
        console.log("matchId: " + match.adversaryId + "\n");
        status.name = states.STRGAME;
        socket?.emit(EventGame.PLAYMACH, { matchId: match.matchId });
      });
      socket?.on(EventGame.STARTSGM, (data) => {
        status.name = states.UPDGAME;
        console.log(states.STRGAME, data);
      });
      socket?.on(EventGame.UPDTGAME, (data) => {
        const parsedData = JSON.parse(data);
        // console.log("UpdateGame", parsedData);
        player1.posi[0] = parsedData.home.posi[0];
        player1.posi[1] = parsedData.home.posi[1];
        player2.posi[0] = parsedData.adversary.posi[0];
        player2.posi[1] = parsedData.adversary.posi[1];
        ballEntity.position[0] = parsedData.bl.posi[0];
        ballEntity.position[1] = parsedData.bl.posi[1];
      });
      socket?.on(EventGame.GAMEOVER, (data) => {
        socket?.emit("leaveGame");
        status.name = EventGame.GAMEOVER;
      });
    }
  }
};

export const update = (socket: Socket | null) => {
  const intervalId = setInterval(() => {
    if (status.name == states.UPDGAME) {
      socket?.emit(states.UPDGAME, { matchId: match.matchId });
      // status.name = states.GAMOVER;
    }
  }, 1);
  return () => clearInterval(intervalId);
};
