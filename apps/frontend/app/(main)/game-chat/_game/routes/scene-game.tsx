"use client";

import { Suspense, useEffect } from "react";
import { Ball } from "../components/ball";
import { Canvas } from "@react-three/fiber";
import { Board } from "../components/board";
import { CamScene } from "../components/camScene";
import { Player } from "../components/player";
import { usePlayer1State, usePlayer2State } from "../state";
import { Scores } from "../components/scores";
import { useBoardState } from "../state/board";

export function SceneGame() {
  const player1 = usePlayer1State();
  const player2 = usePlayer2State();
  const board = useBoardState();
  useEffect(() => {
    board.setTexture();
  }, []);
  return (
    <>
      <Canvas>
        <Suspense>
          <CamScene />
          <Scores />
          <Ball />
          <Player {...player2} />
          <Player {...player1} />
          <Board {...board} />
        </Suspense>
      </Canvas>
    </>
  );
}
