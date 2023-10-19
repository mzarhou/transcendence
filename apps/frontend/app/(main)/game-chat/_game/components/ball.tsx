"use client";

import { Sphere } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useBallState } from "../state/ball";

export function Ball() {
  const ballRef = useRef<THREE.Mesh>(null);
  const ball = useBallState();

  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.position.x = ball.posi[0];
      ballRef.current.position.y = ball.posi[1];
      ballRef.current.position.z = ball.posi[2];
    }
  });
  return (
    <Sphere ref={ballRef} args={ball.size}>
      <meshBasicMaterial color={ball.txtu} />
    </Sphere>
  );
}
