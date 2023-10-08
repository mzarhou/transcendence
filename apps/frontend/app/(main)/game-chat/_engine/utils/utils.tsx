import { useCallback, useEffect, useState } from "react";

import { Socket } from "socket.io-client";
import { ballEntity, player1, player2,  status } from "../entity/entity";

export function PlayerPosition(direction:string) : boolean{
    const [arrowDirection, setArrowDirection] = useState(false);
    const handleKeyDown = useCallback((event:KeyboardEvent) => {
      if (event.key === direction) {
        setArrowDirection(true);
      }
    }, [direction]);
  
    const handleKeyUp = useCallback(() => {
      setArrowDirection(false);
    }, []);
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [handleKeyDown, handleKeyUp]);
    return (arrowDirection);
  }

  export const socketEventListener = async (socket: Socket, room: string) =>   {
  
    if (!socket.hasListeners('connect')){
      socket.on('connect', () => {
        socket.emit('joinGame', room);
        status.name = 'startGame';
      });
    };
    if (!socket.hasListeners('disconnect')){
      socket.on("disconnect", () => {
          socket.emit('leaveGame', room);
          status.name = 'gameOver'
      });
    }
  
    if (!socket.hasListeners('joinedGame')){
      socket.on('joinedGame', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.nbPl == 2){
          console.log("startgame=" + parsedData.plyrs[0].nmPl);
          player1.nmPl = parsedData.plyrs[0].nmPl;
          player1.type = parsedData.plyrs[0].type;
          player2.nmPl = parsedData.plyrs[1].nmPl;
          player2.type = parsedData.plyrs[1].type;
          socket.emit('startGame', room);
        } 
        status.nbPl = parsedData.nbPl;
      })
    }
  
    if (!socket.hasListeners('startGame')){
      socket.on('startGame',()=>{
        status.name = 'updateGame';
        console.log('startgame');
      });
    }
  
    socket.on('updateGame', data => {
        const parsedData = JSON.parse(data);
        ballEntity.position[0] = parsedData.ball.posi[0];
        ballEntity.position[1] = parsedData.ball.posi[1];
        player1.posi[0] = parsedData.plyrs[0].posi[0];
        player1.posi[1] = parsedData.plyrs[0].posi[1];
        player2.posi[0] = parsedData.plyrs[1].posi[0];
        player2.posi[1] = parsedData.plyrs[1].posi[1];
        status.nbPl = parsedData.nbPl;
    })

    if (!socket.hasListeners('gameOver')){
      socket.on('gameOver', data => {
        console.log(data);
        socket.emit('leaveGame', room);
        status.name = 'gameOver';
      })
    }
}  

export const update = (socket:Socket, room: string) => {
    const intervalId = setInterval(() => {
      if (status.name == 'updateGame'){
        socket.emit('update', room );
      }
    }, 1);
    return () => clearInterval(intervalId);
  }
  