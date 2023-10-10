"use client";

import { useEffect, useState } from "react";
import { Ball } from "../components/ball";
import { Canvas } from "@react-three/fiber";
import { Board } from "../components/board";
import { CamScene } from "../components/camScene";
import { Player } from "../components/player";
import {
  EventGame,
  ballEntity,
  boardEntity,
  player1,
  player2,
} from "../entity/entity";
import { socketEventListener, update } from "../utils/utils";
import { useSocket } from "@/context/events-socket-context";

export function SceneGame() {
  const socket = useSocket();
  const [showA, setShowA] = useState(false);

  const toggleComponent = () => {
    socket?.emit(EventGame.JNRNDMCH);
    setShowA(!showA);
  };
  useEffect(() => {
    socketEventListener(socket);
  }, [socket]);

  useEffect(() => update(socket));

  return (
    <>
      {showA ? (
        <Canvas>
          <CamScene />
          <Player {...player2} />
          <Ball {...ballEntity} />
          <Player {...player1} />
          {/* <Walls/> */}
          <Board {...boardEntity} />
        </Canvas>
      ) : (
        <button onClick={toggleComponent}>Toggle Component</button>
      )}
    </>
  );
}
