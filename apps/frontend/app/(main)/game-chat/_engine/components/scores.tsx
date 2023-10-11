import { Text } from "@react-three/drei";

export function Scores() {
  return (
    <>
      <Text
        position={[-125, 100, 0]}
        scale={[60, 60, 10]}
        color="White" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        0
      </Text>
      <Text
        position={[125, -100, 0]}
        scale={[60, 60, 10]}
        color="White" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        0
      </Text>
    </>
  );
}
