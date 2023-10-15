"use client";

import { Box } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePlayerPosition } from "../utils/websocket-events";
import { useSocket } from "@/context";
import { useUser } from "@/context/user-context";
import { PlayerState, usePlayer1State, usePlayer2State } from "../state/player";
import { useMatchState } from "../state";

export function Player(playerProps: PlayerState) {
  const socket = useSocket();
  const p1 = usePlayer1State();
  const p2 = usePlayer2State();
  const { user } = useUser();
  const playerRef = useRef<THREE.Mesh>(null);
  const arrowLeft = usePlayerPosition("ArrowLeft");
  const arrowRight = usePlayerPosition("ArrowRight");
  const { setState, ...match } = useMatchState();

  useEffect(() => {
    console.log({ playerProps, p1, p2 });
  }, [playerProps, p1, p2]);

  useFrame(() => {
    if (playerRef.current) {
      playerRef.current.position.x = playerProps.posi[0];
      playerRef.current.position.y = playerProps.posi[1];
      playerRef.current.position.z = playerProps.posi[2];
    }

    if (user?.id == p1.id) {
      if (arrowLeft) socket?.emit("moveLeft", { match: match });
      if (arrowRight) socket?.emit("moveRight", { match: match });
    }
    if (user?.id == p2.id) {
      if (arrowLeft) socket?.emit("moveRight", { match: match });
      if (arrowRight) socket?.emit("moveLeft", { match: match });
    }
  });

  return (
    <Box ref={playerRef} args={playerProps.size}>
      <meshBasicMaterial color={playerProps.txtu} />
    </Box>
  );
}
