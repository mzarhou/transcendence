import { Text } from "@react-three/drei";
import { usePlayer2State, useScoreState } from "../state";
import { useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";

export function Scores() {
  const scores = useScoreState();
  const { user } = useUser();
  const p2 = usePlayer2State();
  const text1Ref = useRef<THREE.Mesh>();
  const text2Ref = useRef<THREE.Mesh>();
  useEffect(() => {
    if (
      text1Ref.current &&
      text2Ref.current &&
      user?.id == p2.id &&
      text1Ref.current?.rotation.z != Math.PI &&
      text2Ref.current?.rotation.z != -Math.PI
    ) {
      text1Ref.current.rotateZ(Math.PI);
      text2Ref.current.rotateZ(-Math.PI);
    }
  });
  return (
    <>
      <Text
        ref={text1Ref}
        position={[-125, 100, 0]}
        scale={[60, 60, 10]}
        color="White" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        {scores.adversary}
      </Text>
      <Text
        ref={text2Ref}
        position={[125, -100, 0]}
        scale={[60, 60, 10]}
        color="White" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        {scores.home}
      </Text>
    </>
  );
}
