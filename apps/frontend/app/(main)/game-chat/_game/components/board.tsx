"use client";

import { Plane } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { BoardType } from "@transcendence/db";
import React from "react";
import { TextureLoader } from "three";

export function Board(boardProps: BoardType) {
  const colorMap = useLoader(TextureLoader, boardProps.txtu);
  return (
    <Plane position={boardProps.posi} args={boardProps.size}>
      <meshBasicMaterial map={colorMap} />
    </Plane>
  );
}
