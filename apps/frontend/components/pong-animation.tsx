"use client";
import GameHomeLottie from "lotties/game-home-lottie.json";
import Lottie from "react-lottie";

export default function PongAnimation() {
  return (
    <div className="overflow-hidden">
      <Lottie
        style={{
          padding: 0,
          width: "150%",
          marginLeft: "-25%",
        }}
        options={{
          animationData: GameHomeLottie,
          loop: true,
          autoplay: true,
        }}
      />
    </div>
  );
}
