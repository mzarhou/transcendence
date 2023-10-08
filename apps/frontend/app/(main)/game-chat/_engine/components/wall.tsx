import { Box } from "@react-three/drei";
import { ballEntity, boardEntity } from "../entity/entity";


export function Walls(){
    return (
    <> 
        <Box args={[boardEntity.size[0]+20,20,20]} position={[0,-boardEntity.size[1]/2,10]} >
            <meshBasicMaterial color={ballEntity.color}/>
        </Box>
        <Box args={[boardEntity.size[0]+20,20,20]} position={[0,boardEntity.size[1]/2,10]} >
            <meshBasicMaterial color={ballEntity.color}/>
        </Box>
        <Box args={[20,boardEntity.size[1],20]} position={[boardEntity.size[0]/2,0,10]} >
            <meshBasicMaterial color={ballEntity.color}/>
        </Box>
        <Box args={[20,boardEntity.size[1],20]} position={[-boardEntity.size[0]/2,0,10]} >
            <meshBasicMaterial color={ballEntity.color}/>
        </Box>
    </>)
}