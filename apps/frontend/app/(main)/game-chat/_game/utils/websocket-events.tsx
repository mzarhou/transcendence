import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/context";
import { usePlayer1State, usePlayer2State } from "../state/player";
import { useBallState } from "../state/ball";
import { STATUS, useStatus } from "../state/status";
import { useMatchState, useScoreState } from "../state";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GameInvitationData,
  GameOverData,
  MatchFoundData,
  ServerGameEvents,
  StartGameData,
  UpdateGameData,
} from "@transcendence/db";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useAcceptGameInvitation } from "@/api-hooks/game/use-accept-game-invitation";
import { useResetGameState } from "../state/use-reset-state";
import { useCountDownState } from "../state/count-down";

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
  const setStatus = useStatus((s) => s.setStatus);
  const { setState: setMatch } = useMatchState();
  const setHome = useScoreState((s) => s.setHomeScore);
  const setAdversary = useScoreState((s) => s.setAdversary);
  const navigate = useNavigate();
  const location = useLocation();
  const resetGameState = useResetGameState();
  const setCountDown = useCountDownState((state) => state.setCount);

  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners(ServerGameEvents.STARTSGM)) return;

    socket.on(ServerGameEvents.WAITING, (_data: null) => {
      navigate("/waiting", { replace: true });
    });

    socket.on(ServerGameEvents.STARTSGM, (data: StartGameData) => {
      setMatch(data.match);
      setStatus(STATUS.UPDGAME);
      setP1Id(data.match.homeId);
      setP2Id(data.match.adversaryId);
      navigate("/playing", { replace: true });
    });

    socket.on(ServerGameEvents.UPDTGAME, (data: UpdateGameData) => {
      if (location.pathname !== "/playing") {
        navigate("/playing", { replace: true });
      }

      setCountDown(data.countDown);
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
      resetGameState();
      setMatch(data.match);
      setStatus(STATUS.GAMOVER);
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
  const setStatus = useStatus((s) => s.setStatus);
  const navigate = useNavigate();
  const setP1Id = usePlayer1State((state) => state.setId);
  const setP2Id = usePlayer2State((state) => state.setId);
  const resetGameState = useResetGameState();

  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners(ServerGameEvents.MCHFOUND)) return;
    socket.on(ServerGameEvents.MCHFOUND, (data: MatchFoundData) => {
      setP1Id(data.match.homeId);
      setP2Id(data.match.adversaryId);
      setMatch(data.match);
      setStatus(STATUS.STRGAME);
      navigate("/waiting", { replace: true });
    });
    socket.on(ServerGameEvents.GAME_CANCELED, (_data: null) => {
      resetGameState();
      navigate("/", { replace: true });
    });
  }, [socket]);
};

export const useGameInvitationEvents = () => {
  const socket = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners(ServerGameEvents.Invitation)) return;
    socket.on(
      ServerGameEvents.Invitation,
      ({ profile, invitationId }: GameInvitationData) => {
        toast({
          duration: 10 * 1000,
          title: "Game Invitation",
          description: `${profile.name} wants to play against you`,
          action: <AcceptGameInvitationBtn invitationId={invitationId} />,
        });
      }
    );
  }, []);
};

function AcceptGameInvitationBtn({ invitationId }: { invitationId: string }) {
  const { trigger, isMutating } = useAcceptGameInvitation(invitationId);

  const acceptGameInvitation = () => {
    try {
      trigger();
    } catch (error) {}
  };

  return (
    <ToastAction
      altText="Accept"
      onClick={acceptGameInvitation}
      disabled={isMutating}
    >
      {isMutating ? <>Accepting...</> : <>Accept</>}
    </ToastAction>
  );
}
