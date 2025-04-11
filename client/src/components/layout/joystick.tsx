import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { grayPlasticMaterial, redPlasticMaterial, silverMaterial } from '../../lib/materials'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../../redux'
import { setJoystick } from '../../redux/slices/controlsSlice'

export default function Joystick() {

    const { nodes } = useGLTF('models/arcade.glb') as unknown as
        {
            nodes: Record<string, any>,
        }
    const dispatch = useDispatch()

    // Refs
    const joystick = useRef<THREE.Mesh>(null)
    const initialMousePosition = useRef(new THREE.Vector2());
    const currentMousePosition = useRef(new THREE.Vector2());

    // States
    const [isDragging, setIsDragging] = useState(false)

    // Keyboard controls
    const [, get] = useKeyboardControls()

    // Joystick Handlers
    const handlePointerDown = (event: PointerEvent) => {
        setIsDragging(true)
        initialMousePosition.current.set(event.clientX, event.clientY);
        currentMousePosition.current.set(event.clientX, event.clientY);
    }
    const handlePointerMove = (event: PointerEvent) => {
        if (isDragging && joystick.current) {
            currentMousePosition.current.set(event.clientX, event.clientY);
            const deltaX = currentMousePosition.current.x - initialMousePosition.current.x;
            const deltaY = currentMousePosition.current.y - initialMousePosition.current.y;

            // Sensibilidade do movimento (ajuste conforme necessário)
            const sensitivity = 0.005;

            // Calcular rotações alvo
            const targetRotationZ = deltaX * sensitivity; // Esquerda/direita
            const targetRotationX = deltaY * sensitivity; // Frente/trás

            // Aplicar rotações com limites
            joystick.current.rotation.z = Math.max(-0.35, Math.min(0.35, targetRotationZ));
            joystick.current.rotation.x = -Math.max(-0.55, Math.min(0.35, targetRotationX));
            // Ajustar o eixo Y proporcionalmente ao Z, como nas teclas
            joystick.current.rotation.y = joystick.current.rotation.z / 3;
        }
    }
    const handlePointerUp = () => {
        setIsDragging(false)
    }

    useFrame(() => {
        const { up, down, left, right } = get()
        const joystickSpeed = 0.075
        if (joystick.current) {
            if (up && joystick.current.rotation.x < 0.55) joystick.current.rotation.x += joystickSpeed
            if (!up && joystick.current.rotation.x > 0 && !isDragging) joystick.current.rotation.x -= joystickSpeed
            if (down && joystick.current.rotation.x > -0.35) joystick.current.rotation.x -= joystickSpeed
            if (!down && joystick.current.rotation.x < 0 && !isDragging) joystick.current.rotation.x += joystickSpeed
            if (left && joystick.current.rotation.z > -0.35) joystick.current.rotation.z -= joystickSpeed, joystick.current.rotation.y -= joystickSpeed / 3
            if (!left && joystick.current.rotation.z < 0 && !isDragging) joystick.current.rotation.z += joystickSpeed, joystick.current.rotation.y += joystickSpeed / 3
            if (right && joystick.current.rotation.z < 0.35) joystick.current.rotation.z += joystickSpeed, joystick.current.rotation.y += joystickSpeed / 3
            if (!right && joystick.current.rotation.z > 0.07 && !isDragging) joystick.current.rotation.z -= joystickSpeed, joystick.current.rotation.y -= joystickSpeed / 3
            dispatch(setJoystick({ up: joystick.current.rotation.x > 0.075 ? true : false, down: joystick.current.rotation.x < -0.075 ? true : false, left: joystick.current.rotation.z < -0.075, right: joystick.current.rotation.z > 0.075 }))
        }
    })

    // Capturar movimentos do mouse fora do joystick
    useEffect(() => {
        const handleGlobalPointerMove = (event: PointerEvent) => handlePointerMove(event);
        const handleGlobalPointerUp = () => handlePointerUp();
        window.addEventListener('pointermove', handleGlobalPointerMove);
        window.addEventListener('pointerup', handleGlobalPointerUp);
        return () => {
            window.removeEventListener('pointermove', handleGlobalPointerMove);
            window.removeEventListener('pointerup', handleGlobalPointerUp);
        };
    }, [isDragging]);

    return (
        <>
            <group ref={joystick} dispose={null} position={[0.478, 2.54, -0.86]} rotation={[0, 0, 0]}>
                <mesh castShadow onPointerDown={(e: PointerEvent) => handlePointerDown(e)} onPointerUp={() => handlePointerUp()} onPointerMove={(e: PointerEvent) => handlePointerMove(e)} position={[-0.478, -2.55, 0.86]} receiveShadow geometry={nodes.Cube012.geometry} material={redPlasticMaterial} />
                <mesh
                    castShadow
                    position={[-0.478, -2.55, 0.86]}
                    receiveShadow
                    geometry={nodes.Cube012_1.geometry}
                    material={silverMaterial}
                />
            </group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.JoystickMover.geometry}
                material={grayPlasticMaterial}
            />
        </>
    )
}

useGLTF.preload('models/arcade.glb')