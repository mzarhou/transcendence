"use client";

import { useEffect, useState } from "react";

import { SceneGame } from "./ui/scene-game";
import { JoinMatch } from "./ui/join-match";
import { WaitingMatch } from "./ui/waitting-match";
import { GameOver } from "./ui/game-over";
import {
  Route,
  Routes,
  useLocation,
  MemoryRouter,
  useNavigate,
} from "react-router-dom";
import {
  useMatchFoundEvent,
  useSetGameEvents,
  useUpdateGame,
} from "./utils/websocket-events";

const InitialRouteKey = "/";

function DetectRouteChanges() {
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem(InitialRouteKey, location.pathname);
  }, [location]);
  return <></>;
}

function GameEvents() {
  const navigate = useNavigate();

  useSetGameEvents();
  useMatchFoundEvent();
  useUpdateGame();

  return <></>;
}

export default function GameRouter() {
  const [initialRoute, setInitialRoute] = useState("");

  useEffect(() => {
    const initialRoute = window.localStorage.getItem(InitialRouteKey);
    setInitialRoute(initialRoute ?? "/");
  }, []);

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <DetectRouteChanges />
      <GameEvents />
      <Routes>
        <Route path="/" element={<JoinMatch />} />
        <Route path="/waiting" element={<WaitingMatch />} />
        <Route path="/playing" element={<SceneGame />} />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
    </MemoryRouter>
  );
}
