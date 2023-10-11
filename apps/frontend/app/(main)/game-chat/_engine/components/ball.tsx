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
      ballRef.current.position.x = ball.position[0];
      ballRef.current.position.y = ball.position[1];
      ballRef.current.position.z = ball.position[2];
    }
  });
  return (
    <Sphere ref={ballRef} args={ball.size}>
      <meshBasicMaterial color={ball.color} />
    </Sphere>
  );
}
