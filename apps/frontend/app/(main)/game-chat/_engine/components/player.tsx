import { Box } from "@react-three/drei"
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {  player1,  player2,  room, socket } from "../entity/entity";
import { PlayerPosition } from "../utils/utils";

export interface playerType {
    nmPl: string,
    type: string,
    posi: [x:number, y:number, z:number]
    size: [length:number, width:number, height:number]
    txtu: string
}

export interface statusType {
    name: string,
    nbPl: number
}

export function Player(playerProps:playerType)  {
    const player = useRef<THREE.Mesh>(null);
    const arrowLeft = PlayerPosition('ArrowLeft');
    const arrowRight = PlayerPosition('ArrowRight');
    useFrame(()=>{
        if (player.current){
            player.current.position.x = playerProps.posi[0];
            player.current.position.y = playerProps.posi[1];
            player.current.position.z = playerProps.posi[2];
        }
        if ( socket.id == player1.nmPl ){
            if (arrowLeft)
                socket.emit('moveLeft',room,player1.nmPl);
            if (arrowRight)
                socket.emit('moveRight',room,player1.nmPl);
        } 
        if (socket.id == player2.nmPl){
            if (arrowLeft)
                socket.emit('moveRight',room,player1.nmPl);
            if (arrowRight)
                socket.emit('moveLeft',room,player1.nmPl);
        }
    });
    return (
    <Box ref={player} args={playerProps.size}>
        <meshBasicMaterial color={playerProps.txtu}/>
    </Box>
    )
}

