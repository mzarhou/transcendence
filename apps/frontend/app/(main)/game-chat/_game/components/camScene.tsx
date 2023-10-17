"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Stats } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import { PointLight } from "three";
import { useUser } from "@/context/user-context";
import { usePlayer2State } from "../state/player";

function Cam() {
  const { user } = useUser();
  const p2 = usePlayer2State();
  const ref = useRef<THREE.PerspectiveCamera>(null);

  const handleResize = () => {
    if (ref.current) {
      if (window.innerWidth <= 1274) ref.current.position.z = 900;
      else ref.current.position.z = 545;
    }
  };

  useEffect(() => {
    if (ref.current && user?.id == p2.id && ref.current?.rotation.z != Math.PI)
      ref.current?.rotateZ(Math.PI);
    if (ref.current) {
      if (window.innerWidth <= 1274) ref.current.position.z = 900;
      else ref.current.position.z = 545;

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }

    // if (threeD){
    // ref.current.position.x = 0;
    // ref.current.position.y = -540;
    // ref.current.position.z = 270;
    // ref.current.rotation.x = 1.108;
    // ref.current.rotation.y = 0;
    // ref.current.rotation.z = 0;
    // }

    // return () => clearTimeout(to);
  }, [ref, p2.id, user?.id, ref.current?.zoom, ref.current?.fov]);

  return (
    <>
      <PerspectiveCamera
        ref={ref}
        makeDefault
        position={[0, 0, 545]}
        fov={80}
        near={0.1}
        far={5000}
        aspect={window.innerWidth / window.innerHeight}
        up={[0, 0, 1]}
      />
      {/* <OrbitControls /> */}
      <Stats />
    </>
  );
}

function Light() {
  const lightRef = useRef<PointLight>(null);
  lightRef.current?.lookAt(0, 0, 0);
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight ref={lightRef} position={[0, 0, 100]} />
    </>
  );
}

export function CamScene() {
  return (
    <>
      <Cam />
      <Light />
    </>
  );
}