import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/context";
import { usePlayer1State, usePlayer2State } from "../state/player";
import { useBallState } from "../state/ball";
import { useMatchState, useScoreState } from "../state";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GameOverData,
  MatchFoundData,
  ServerGameEvents,
  StartGameData,
  UpdateGameData,
} from "@transcendence/db";

export function usePlayerPosition(direction: string): boolean {
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

export const useSetGameEvents = () => {
  const socket = useSocket();
  const setP1Position = usePlayer1State((state) => state.setPosition);
  const setP2Position = usePlayer2State((state) => state.setPosition);
  const setP1Id = usePlayer1State((state) => state.setId);
  const setP2Id = usePlayer2State((state) => state.setId);
  const setBallPosition = useBallState((state) => state.setPosition);
  const { setState: setMatch } = useMatchState();
  const setHome = useScoreState((s) => s.setHomeScore);
  const setAdversary = useScoreState((s) => s.setAdversary);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners(ServerGameEvents.STARTSGM)) return;

    socket.on(ServerGameEvents.STARTSGM, (data: StartGameData) => {
      setMatch(data.match);
      setP1Id(data.match.homeId);
      setP2Id(data.match.adversaryId);
      navigate("/playing", { replace: true });
    });

    socket.on(ServerGameEvents.UPDTGAME, (data: UpdateGameData) => {
      if (location.pathname !== "/playing") {
        navigate("/playing", { replace: true });
      }
      setMatch(data.match);
      setP1Id(data.match.homeId);
      setP2Id(data.match.adversaryId);
      setHome(data.scores.home);
      setAdversary(data.scores.adversary);
      setP1Position({
        x: data.home.posi[0],
        y: data.home.posi[1],
        z: data.home.posi[2],
      });
      setP2Position({
        x: data.adversary.posi[0],
        y: data.adversary.posi[1],
        z: data.adversary.posi[2],
      });
      setBallPosition({
        x: data.bl.posi[0],
        y: data.bl.posi[1],
        z: data.bl.posi[2],
      });
    });

    socket.on(ServerGameEvents.GAMEOVER, (data: GameOverData) => {
      setMatch({ winnerId: data.winnerId });
      navigate("/gameover");
    });
    return () => {
      socket.off(ServerGameEvents.STARTSGM);
      socket.off(ServerGameEvents.UPDTGAME);
      socket.off(ServerGameEvents.MCHFOUND);
      socket.off(ServerGameEvents.GAMEOVER);
    };
  }, [socket]);
};

export const useMatchFoundEvent = () => {
  const socket = useSocket();
  const { setState: setMatch } = useMatchState();

  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners(ServerGameEvents.MCHFOUND)) return;
    socket.on(ServerGameEvents.MCHFOUND, (data: MatchFoundData) => {
      console.log(data);
      setMatch(data.match);
    });
  }, [socket]);
};
