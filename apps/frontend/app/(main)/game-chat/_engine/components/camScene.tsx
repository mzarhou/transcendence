import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Stats } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PointLight, Vector3 } from "three";
import { boardEntity, player2, socket } from "../entity/entity";

function Cam() {
    const ref = useRef<THREE.PerspectiveCamera>(null);
    useEffect(()=>{
        if (ref.current){
            if (socket.id == player2.nmPl)
                ref.current.rotateZ(Math.PI);
            // if (threeD){
            // ref.current.position.x = 0;
            // ref.current.position.y = -540;
            // ref.current.position.z = 270;
            // ref.current.rotation.x = 1.108;
            // ref.current.rotation.y = 0;
            // ref.current.rotation.z = 0;
            // }
        }
    });
    return (
    <>
        <PerspectiveCamera ref={ref}
        makeDefault 
        position={[0, 0, 545]} 
        fov={80}  
        near={0.1}  
        far={5000} 
        aspect={window.innerWidth/window.innerHeight}
        up={[0,0,1]}
        />
        {/* <OrbitControls  /> */}
        <Stats/>
    </>
    )
};

function Light() {
    const lightRef = useRef<PointLight>(null);
    lightRef.current?.lookAt(0,0,0);
    return (
    <>
        <ambientLight intensity={0.5} />
        <pointLight ref={lightRef} position={[0, 0, 100]}/>
    </>
    )
};


export function CamScene() {
    return (
        <>
            <Cam/>
            <Light/>
        </>
    )
};