import { Canvas, GLProps, useFrame, useThree } from "@react-three/fiber";
import { JSX, useRef } from "react";
import * as THREE from "three";
import { PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Arcade from "./arcade";

export default function Screen({ children }: { children: JSX.Element | null }) {

    const { size } = useThree();

    // Responsivity
    const aspectRatio = size.width / size.height;
    const cameraFov = aspectRatio > 2 ? aspectRatio > 3 ? 32 : 40 : aspectRatio < 1 ? aspectRatio < 0.85 ? aspectRatio < 0.5 ? 50 * (1 + 0.5 * (1 / aspectRatio - 1)) : 60 * (1 + 0.5 * (1 / aspectRatio - 1)) : 60 : 50;
    const cameraYPosition = aspectRatio > 2 ? aspectRatio > 3 ? 2.15 : 2.5 : aspectRatio < 0.5 ? 2.425 : 2.9;
    const cameraXRotation = aspectRatio > 2 ? aspectRatio > 3 ? 0.39 : 0.25 : aspectRatio < 0.5 ? 0.3 : 0.1;
    const arcadeStretch = aspectRatio > 2 ? aspectRatio > 3 ? 0 : 0.125 : aspectRatio < 0.5 ? 0.05 : 0;
    const cameraZRotation = aspectRatio < 0.85 ? Math.PI / 2 : 0;

    // Refs
    const light1 = useRef<THREE.SpotLight | null>(null);
    const light2 = useRef<THREE.SpotLight | null>(null);

    // Function to update the arcade lights color based on time
    const getCycleColor = (t: number) => {
        const colorMin = 0.5;
        const colorMax = 0.8;
        const colorRange = colorMax - colorMin;
        const hue = colorMin + (Math.sin(t * 0.2) * 0.5 + 0.5) * colorRange;
        const saturation = 0.8;
        const lightness = 0.5;
        return new THREE.Color().setHSL(hue, saturation, lightness);
    };

    // Update the arcade lights color based on time
    useFrame((state) => {

        const t = state.clock.elapsedTime;
        const color = getCycleColor(t);

        if (light1.current) {
            if (!light1.current.target.position.equals(new THREE.Vector3(0, 3.3, 0))) {
                light1.current.target.position.set(0, 3.3, 0);
                light1.current.target.updateMatrixWorld();
            }
            light1.current.color = color;
        }
        if (light2.current) {
            if (!light2.current.target.position.equals(new THREE.Vector3(0, 3.3, 0))) {
                light2.current.target.position.set(0, 3.3, 0);
                light2.current.target.updateMatrixWorld();
            }
            light2.current.color = color;
        }
    });

    return (
        <>
            <spotLight
                position={[1, 2, 3]}
                intensity={40}
                castShadow
                penumbra={0.4}
                angle={0.5}
                ref={light1}
                color={0x8A74F5}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0005}
            />
            <spotLight
                position={[0, 7, 0]}
                intensity={15}
                castShadow
                penumbra={0.4}
                angle={Math.PI / 2}
                ref={light2}
                color="white"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0005}
            />
            <ambientLight intensity={0.05} />
            <PerspectiveCamera makeDefault near={0.01} far={6} position={[0, cameraYPosition, 2.7]} rotation={[cameraXRotation, 0, cameraZRotation]} fov={cameraFov} />
            <Arcade position={[0, 0, 0]} scale={[1 + arcadeStretch, 1, 1]} rotation={[0, Math.PI, 0]}>
                {children}
            </Arcade>
            <EffectComposer>
                <Bloom
                    intensity={0.1}
                    luminanceThreshold={0.7}
                    luminanceSmoothing={0.05}
                />
            </EffectComposer>
        </>
    )
}