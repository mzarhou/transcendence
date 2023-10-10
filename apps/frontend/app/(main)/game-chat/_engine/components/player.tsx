import { Box } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { player1, player2 } from "../entity/entity";
import { PlayerPosition, matchId } from "../utils/utils";
import { useSocket } from "@/context/events-socket-context";
import { useUser } from "@/context/user-context";

export interface playerType {
  nmPl: number;
  posi: [x: number, y: number, z: number];
  size: [length: number, width: number, height: number];
  txtu: string;
}

export interface statusType {
  name: string;
}

export function Player(playerProps: playerType) {
  const socket = useSocket();
  const { user } = useUser();
  const player = useRef<THREE.Mesh>(null);
  const arrowLeft = PlayerPosition("ArrowLeft");
  const arrowRight = PlayerPosition("ArrowRight");
  useFrame(() => {
    if (player.current) {
      player.current.position.x = playerProps.posi[0];
      player.current.position.y = playerProps.posi[1];
      player.current.position.z = playerProps.posi[2];
    }
    if (user?.id == player1.nmPl) {
      if (arrowLeft) socket?.emit("moveLeft", { matchId }, player1.nmPl);
      if (arrowRight) socket?.emit("moveRight", { matchId }, player1.nmPl);
    }
    if (user?.id == player2.nmPl) {
      if (arrowLeft) socket?.emit("moveRight", { matchId }, player1.nmPl);
      if (arrowRight) socket?.emit("moveLeft", { matchId }, player1.nmPl);
    }
  });
  return (
    <Box ref={player} args={playerProps.size}>
      <meshBasicMaterial color={playerProps.txtu} />
    </Box>
  );
}
