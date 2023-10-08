import { Sphere } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";


export interface ballType{
    position: [x:number,y:number,z:number],
    size: [radius:number,width:number,height:number]
    color: string
}

export  function Ball(ballProps:ballType){
    const ballRef = useRef<THREE.Mesh>(null)
    
    useFrame(()=>{
        if (ballRef.current){
            ballRef.current.position.x = ballProps.position[0];
            ballRef.current.position.y = ballProps.position[1];
            ballRef.current.position.z = ballProps.position[2];
        }
    });
    return (
        <Sphere ref={ballRef} args={ballProps.size}>
            <meshBasicMaterial color={ballProps.color}/>
        </Sphere>
    );
};