"use client";

import { Plane, useTexture } from "@react-three/drei";
import { BoardType } from "@transcendence/db";
import React from "react";

export function Board(boardProps: BoardType) {
  const colorMap = useTexture(boardProps.txtu);
  return (
    <Plane position={boardProps.posi} args={boardProps.size}>
      <meshBasicMaterial map={colorMap} />
    </Plane>
  );
}
