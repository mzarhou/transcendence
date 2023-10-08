import { playerType, statusType } from "../components/player";
import { ballType } from "../components/ball";
import { boardType } from "../components/board";
import { Socket, io } from "socket.io-client";

export const room = 'gameRoom';

export const socket =  io('http://localhost:5500');


export let player1:playerType = {
    nmPl: '',
    type: '',
    posi: [0,-330,15],
    size: [100,10,30],
    txtu: "red"
  }
  
  export let player2:playerType = {
    nmPl: '',
    type: '',
    posi: [0,330,15],
    size: [100,10,30],
    txtu: "blue"
  }
  
  export let ballEntity:ballType = {
    position:[0,0,20],
    size:[20,15,15],
    color: "white",
  }

  export let boardEntity:boardType = {
    position:[0,0,0],
    size:[600,800],
    txtu:'background.png',
  }
  
  export let status:statusType = {
    name: 'connect',
    nbPl: 0
  }


  export function left(player:playerType){
    player.posi[0] -= 10;
    if (player.posi[0] - 60 < -boardEntity.size[0]/2)
        player.posi[0] = -boardEntity.size[0]/2  + 60; 
  }
  
 export function right(player:playerType){
    player.posi[0] += 10;
    if (player.posi[0] + 60 > boardEntity.size[0]/2)
        player.posi[0] = boardEntity.size[0]/2 - 60;
  }