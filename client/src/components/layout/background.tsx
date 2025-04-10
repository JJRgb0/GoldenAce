import { Canvas, GLProps, useFrame, useThree } from "@react-three/fiber";
import { ReactElement, useRef } from "react";
import * as THREE from "three";
import Arcade from "./Arcade";
import { PerspectiveCamera } from "@react-three/drei";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const SceneContent = ({ children }: { children: ReactElement }) => {
    const { size } = useThree();

    // Responsividade
    const aspectRatio = size.width / size.height;
    const cameraFov = aspectRatio > 2 ? aspectRatio > 3 ? 32 : 40 : aspectRatio < 1 ? aspectRatio < 0.85 ? aspectRatio < 0.5 ? 50 * (1 + 0.5 * (1 / aspectRatio - 1)) : 60 * (1 + 0.5 * (1 / aspectRatio - 1)) : 60 : 50;
    const cameraYPosition = aspectRatio > 2 ? aspectRatio > 3 ? 2.15 : 2.5 : aspectRatio < 0.5 ? 2.425 : 2.9;
    const cameraXRotation = aspectRatio > 2 ? aspectRatio > 3 ? 0.39 : 0.25 : aspectRatio < 0.5 ? 0.3 : 0.1;
    const arcadeStretch = aspectRatio > 2 ? aspectRatio > 3 ? 0 : 0.125 : aspectRatio < 0.5 ? 0.05 : 0;
    // Girar a câmera para celulares
    const cameraZRotation = aspectRatio < 0.85 ? Math.PI / 2 : 0;

    // Referência das spotlights
    const light1 = useRef<THREE.SpotLight | null>(null);
    const light2 = useRef<THREE.SpotLight | null>(null);

    useFrame((state) => {

        // Usar o tempo da cena para criar o ciclo de cores das spotlights
        const t = state.clock.elapsedTime;

        // Ciclo de cores usando HSL (mais suave)
        const blueMin = 0.5;  // Início do azul
        const blueMax = 0.7;  // Fim do azul
        const blueRange = blueMax - blueMin;
        const hue = blueMin + (Math.sin(t * 0.2) * 0.5 + 0.5) * blueRange;
        const saturation = 0.8;
        const lightness = 0.5;

        // Converter HSL para RGB e aplicar à spotlight
        const color = new THREE.Color().setHSL(hue, saturation, lightness);

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
            <PerspectiveCamera makeDefault position={[0, cameraYPosition, 2.7]} rotation={[cameraXRotation, 0, cameraZRotation]} fov={cameraFov} />
            <Arcade position={[0, 0, 0]} scale={[1 + arcadeStretch, 1, 1]} rotation={[0, Math.PI, 0]}>
                {children}
            </Arcade>
        </>
    );
};

export default function Screen({ children }: { children: ReactElement }) {
    const visible = useSelector((state: IRootState) => state.arcadeVisible[0].visible);
    return (
        <div className={cn("relative w-full h-screen duration-1200", visible ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <Canvas tabIndex={!visible ? -1 : 0} className="absolute inset-0 z-0" shadows={{ type: THREE.PCFSoftShadowMap }} gl={{ antialias: true, shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } } as GLProps}>
                <SceneContent>
                    {children}
                </SceneContent>
                <EffectComposer>
                    <Bloom
                        intensity={0.15} // Intensidade do brilho
                        luminanceThreshold={0.7} // Limiar de luminância (aplica o bloom apenas a áreas brilhantes)
                        luminanceSmoothing={0.05} // Suavidade do efeito
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}