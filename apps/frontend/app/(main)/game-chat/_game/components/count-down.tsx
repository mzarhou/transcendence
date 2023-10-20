import { useEffect, useRef } from "react";
import { useCountDownState } from "../state/count-down";
import { Text } from "@react-three/drei";
import { usePlayer2State } from "../state";
import { useUser } from "@/context";

export function CountDown() {
  const { countDown } = useCountDownState();
  const countDownRef = useRef<THREE.Mesh>();
  const p2 = usePlayer2State();
  const { user } = useUser();

  useEffect(() => {
    if (
      countDownRef.current &&
      user?.id == p2.id &&
      countDownRef.current?.rotation.z != Math.PI
    ) {
      countDownRef.current.rotateZ(Math.PI);
    }
  }, [countDownRef.current, user]);

  if (countDown <= 0) return <></>;

  return (
    <Text
      ref={countDownRef}
      position={[0, 0, 0]}
      scale={[400, 400, 200]}
      fillOpacity={0.5}
      color="White"
      anchorX="center"
      anchorY="middle"
    >
      {countDown}
    </Text>
  );
}
