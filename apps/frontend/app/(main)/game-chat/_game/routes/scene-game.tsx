"use client";

import { Suspense } from "react";
import { Ball } from "../components/ball";
import { Canvas } from "@react-three/fiber";
import { Board } from "../components/board";
import { CamScene } from "../components/camScene";
import { Player } from "../components/player";
import { boardEntity } from "../entity/entity";
import { usePlayer1State, usePlayer2State } from "../state";
import { Scores } from "../components/scores";
import { CountDown } from "../components/count-down";

export function SceneGame() {
  const player1 = usePlayer1State();
  const player2 = usePlayer2State();

  return (
    <>
      <Canvas>
        <Suspense>
          <CamScene />
          <Scores />
          <CountDown />
          <Ball />
          <Player {...player2} />
          <Player {...player1} />
          <Board {...boardEntity} />
        </Suspense>
      </Canvas>
    </>
  );
}
