"use client";

import { useEffect, useState } from "react";

import { SceneGame } from "./ui/scene-game";
import { JoinMatch } from "./ui/join-match";
import { WaitingMatch } from "./ui/waitting-match";
import { GameOver } from "./ui/game-over";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  MemoryRouter,
  BrowserRouter,
} from "react-router-dom";

const InitialRouteKey = "/";

function DetectRouteChanges() {
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem(InitialRouteKey, location.pathname);
  }, [location]);
  return <JoinMatch />;
}

export default function GameRouter() {
  const [initialRoute, setInitialRoute] = useState("");

  useEffect(() => {
    const initialRoute = window.localStorage.getItem(InitialRouteKey);
    setInitialRoute(initialRoute ?? "/");
  }, []);

  if (initialRoute === "") {
    return <></>;
  }

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <DetectRouteChanges />
      <Routes>
        <Route path="/" element={<JoinMatch />} />
        <Route path="/waiting" element={<WaitingMatch />} />
        <Route path="/playing" element={<SceneGame />} />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
    </MemoryRouter>
  );
}
