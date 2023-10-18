"use client";

import { Box } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePlayerPosition } from "../utils/websocket-events";
import { useSocket } from "@/context";
import { useUser } from "@/context/user-context";
import { PlayerState, usePlayer1State, usePlayer2State } from "../state/player";
import { useMatchState } from "../state";
import {
  ClientGameEvents,
  MoveLeftData,
  MoveRightData,
} from "@transcendence/db";

export function Player(playerProps: PlayerState) {
  const socket = useSocket();
  const p1 = usePlayer1State();
  const p2 = usePlayer2State();
  const { user } = useUser();
  const playerRef = useRef<THREE.Mesh>(null);
  const arrowLeft = usePlayerPosition("ArrowLeft");
  const arrowRight = usePlayerPosition("ArrowRight");
  const { setState, ...match } = useMatchState();

  useFrame(() => {
    if (playerRef.current) {
      playerRef.current.position.x = playerProps.posi[0];
      playerRef.current.position.y = playerProps.posi[1];
      playerRef.current.position.z = playerProps.posi[2];
    }

    if (user?.id == p1.id) {
      if (arrowLeft)
        socket?.emit(ClientGameEvents.MoveLeft, {
          match: match,
        } satisfies MoveLeftData);
      if (arrowRight)
        socket?.emit(ClientGameEvents.MoveRight, {
          match: match,
        } satisfies MoveRightData);
    }
    if (user?.id == p2.id) {
      if (arrowLeft)
        socket?.emit(ClientGameEvents.MoveRight, {
          match: match,
        } satisfies MoveRightData);
      if (arrowRight)
        socket?.emit(ClientGameEvents.MoveLeft, {
          match: match,
        } satisfies MoveLeftData);
    }
  });

  return (
    <Box ref={playerRef} args={playerProps.size}>
      <meshBasicMaterial color={playerProps.txtu} />
    </Box>
  );
}
