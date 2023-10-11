import { Text } from "@react-three/drei";
import { useScoreState } from "../state";

export function Scores() {
  const scores = useScoreState();
  return (
    <>
      <Text
        position={[-125, 100, 0]}
        scale={[60, 60, 10]}
        color="White" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        {scores.adversary}
      </Text>
      <Text
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
