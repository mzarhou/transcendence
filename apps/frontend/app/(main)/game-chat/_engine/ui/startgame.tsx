import React, { useState } from "react";
import { SceneGame } from "./scene";

function StartGame() {
  const [showComponentA, setShowComponentA] = useState(false);

  const toggleComponent = () => {
    setShowComponentA(!showComponentA);
  };

  return (
    <>
      {showComponentA ? (
        <SceneGame />
      ) : (
        <button onClick={toggleComponent}>Toggle Component</button>
      )}
    </>
  );
}

export default StartGame;
