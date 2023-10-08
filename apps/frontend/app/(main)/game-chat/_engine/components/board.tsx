import { Plane } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import React from "react";
import { TextureLoader } from "three";


export interface boardType{
    position: [x:number,y:number,z:number],
    size: [width:number,height:number]
    txtu: string
}

export function Board(boardProps:boardType){
    const colorMap = useLoader(TextureLoader, boardProps.txtu);
    return (
        <Plane position={boardProps.position} args={boardProps.size}>
            <meshBasicMaterial map={colorMap}/>
        </Plane>)
};