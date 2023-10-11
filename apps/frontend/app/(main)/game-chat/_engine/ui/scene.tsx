"use client";

import { Suspense, useState } from "react";
import { Ball } from "../components/ball";
import { Canvas } from "@react-three/fiber";
import { Board } from "../components/board";
import { CamScene } from "../components/camScene";
import { Player } from "../components/player";
import { EventGame, boardEntity } from "../entity/entity";
import { useSetGameEvents, useUpdateGame } from "../utils/websocket-events";
import { useSocket } from "@/context/events-socket-context";
import { usePlayer1State, usePlayer2State } from "../state";
import { Scores } from "../components/scores";

export function SceneGame() {
  const socket = useSocket();
  const [showA, setShowA] = useState(false);

  const player1 = usePlayer1State();
  const player2 = usePlayer2State();

  useSetGameEvents();
  useUpdateGame();

  const toggleComponent = () => {
    socket?.emit(EventGame.JNRNDMCH);
    setShowA(!showA);
  };

  return (
    <>
      {showA ? (
        <Canvas>
          <Suspense>
            <CamScene />
            <Scores />
            <Player {...player2} />
            <Ball />
            <Player {...player1} />
            <Board {...boardEntity} />
          </Suspense>
        </Canvas>
      ) : (
        <button onClick={toggleComponent}>JoinMatch</button>
      )}
    </>
  );
}
