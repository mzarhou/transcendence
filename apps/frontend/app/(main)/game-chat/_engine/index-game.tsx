"use client";

import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  MemoryRouter,
  useLocation,
  Router,
  useNavigate,
} from "react-router";
import { SceneGame } from "./ui/scene-game";
import { JoinMatch } from "./ui/join-match";
import { WaitingMatch } from "./ui/waitting-match";
import { GameOver } from "./ui/game-over";

const InitialRouteKey = "game-route";

function DetectRouteChanges() {
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem(InitialRouteKey, location.pathname);
  }, [location]);
  return <></>;
}

export default function GameRouter() {
  const [initialRoute, setInitialRoute] = useState("");
  const navi = useNavigate();
  useEffect(() => {
    const initialRoute = window.localStorage.getItem(InitialRouteKey);
    setInitialRoute(initialRoute ?? "/");
  }, []);

  if (initialRoute === "") {
    navi("/");
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
