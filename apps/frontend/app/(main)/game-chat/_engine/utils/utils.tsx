import { Socket } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
import { EventGame, states,  status } from "../entity/entity";


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

  export const socketEventListener = async (socket: Socket|null, room: number) =>   {
    socket?.emit(EventGame.JNRNDMCH, room);
    if(socket?.hasListeners(EventGame.MCHFOUND)){
      socket.on(EventGame.MCHFOUND,(data)=>{
        room = data;
        socket?.emit(EventGame.PLAYMACH, room); 
      });
    }

    if (!socket?.hasListeners(EventGame.STARTSGM)){
      socket?.on(EventGame.STARTSGM,()=>{
        status.name = states.UPDGAME;
        console.log(states.STRGAME);
      });
    }
  
    socket?.on(EventGame.UPDTGAME, data => {
        const parsedData = JSON.parse(data);
        console.log('UpdateGame'+ parsedData);
    })

    if (!socket?.hasListeners(EventGame.GAMEOVER)){
      socket?.on(EventGame.GAMEOVER, data => {
        console.log(data);
        socket?.emit('leaveGame', room);
        status.name = EventGame.GAMEOVER;
      })
    }
}  

export const update = (socket:Socket|null, room: number) => {
    const intervalId = setInterval(() => {
      if (status.name == states.UPDGAME) {
        socket?.emit(states.UPDGAME, room );
      }
    }, 1);
    return () => clearInterval(intervalId);
  }
  