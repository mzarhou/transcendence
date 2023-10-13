"use client";

import { Suspense, useState } from "react";
import { Ball } from "../components/ball";
import { Canvas } from "@react-three/fiber";
import { Board } from "../components/board";
import { CamScene } from "../components/camScene";
import { Player } from "../components/player";
import { boardEntity } from "../entity/entity";
import { useSetGameEvents, useUpdateGame } from "../utils/websocket-events";
import { usePlayer1State, usePlayer2State } from "../state";
import { Scores } from "../components/scores";

export function SceneGame() {
  const player1 = usePlayer1State();
  const player2 = usePlayer2State();

  useSetGameEvents();
  useUpdateGame();

  return (
    <>
      <Canvas>
        <Suspense>
          <CamScene />
          <Scores />
          <Ball />
          <Player {...player2} />
          <Player {...player1} />
          <Board {...boardEntity} />
        </Suspense>
      </Canvas>
    </>
  );
}
