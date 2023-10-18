"use client";

import { useEffect, useState } from "react";

import { SceneGame } from "./routes/scene-game";
import { Route, Routes, useLocation, MemoryRouter } from "react-router-dom";
import {
  useGameInvitationEvents,
  useMatchFoundEvent,
  useSetGameEvents,
} from "./utils/websocket-events";
import GameSettings from "./routes/game-settings";
import MatchMaking from "./routes/match-making";
import GameHome from "./routes/game-home";
import { GameOver } from "./routes/game-over";

const InitialRouteKey = "/";

function DetectRouteChanges() {
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem(InitialRouteKey, location.pathname);
  }, [location]);
  return <></>;
}

function GameEvents() {
  useSetGameEvents();
  useMatchFoundEvent();
  useGameInvitationEvents();

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
      <div className="relative h-full overflow-y-auto px-6 font-boogaloo">
        <Routes>
          <Route path="/" element={<GameHome />} />
          <Route path="/waiting" element={<MatchMaking />} />
          <Route path="/playing" element={<SceneGame />} />
          <Route path="/game-settings" element={<GameSettings />} />
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}
