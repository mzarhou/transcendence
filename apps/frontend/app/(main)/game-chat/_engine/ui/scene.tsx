"use client"

import { useEffect } from "react";
import { Ball } from "../components/ball";
import { Walls } from "../components/wall";
import { Canvas } from "@react-three/fiber";
import { Board } from "../components/board";
import { CamScene } from "../components/camScene";
import {Player } from "../components/player";
import { ballEntity, boardEntity, player1, player2, room} from "../entity/entity";
import { socketEventListener, update } from "../utils/utils";
import { useSocket } from "@/context/events-socket-context";


export function SceneGame () {
  const socket = useSocket(); 
  useEffect(()=>{socketEventListener(socket,room);},[]);
  useEffect(()=>{update(socket,room)});

  return (
    <Canvas >
        <CamScene/>
        <Player {... player2}/>
        <Ball {... ballEntity}/>
        <Player {... player1}/>
        {/* <Walls/> */}
        <Board {... boardEntity}/>
    </Canvas>);
}

