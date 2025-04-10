
import { JSX, useRef } from 'react'
import { Html, KeyboardControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import Joystick from './joystick';
import Buttons from './buttons';
import { darkPlasticMaterial, grayPlasticMaterial, neonYellowMaterial, screenMaterial } from '../../lib/materials';

const Arcade = (props: JSX.IntrinsicElements['group']) => {

  const { nodes, materials } = useGLTF('models/arcade.glb') as unknown as
    {
      nodes: Record<string, any>,
      materials: Record<string, any>
    }

  const bordasFliperama = useRef<THREE.Mesh>(null)

  useFrame((state) => {

    // Usar o tempo da cena para criar o ciclo de cores das spotlights
    const t = state.clock.elapsedTime

    // Ciclo de cores usando HSL (mais suave)
    const blueMin = 0.5;  // Início do azul
    const blueMax = 0.7;  // Fim do azul
    const blueRange = blueMax - blueMin;
    const hue = blueMin + (Math.sin(t * 0.2) * 0.5 + 0.5) * blueRange;
    const saturation = 0.8;
    const lightness = 0.5;

    // Converter HSL para RGB e aplicar à spotlight
    const color = new THREE.Color().setHSL(hue, saturation, lightness);

    if (bordasFliperama.current) {
      (bordasFliperama.current.material as THREE.MeshStandardMaterial).color = color;
      (bordasFliperama.current.material as THREE.MeshStandardMaterial).emissive = color;
    }

  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Fundo.geometry}
        material={materials['Material.003']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Golden_Ace.geometry}
        material={neonYellowMaterial}
      />
      <mesh castShadow receiveShadow geometry={nodes.Screen.geometry} material={screenMaterial} >
        {/* Conteúdo da tela do fliperama */}
        <Html occlude="blending" receiveShadow visible={false} distanceFactor={0.456} center className='absolute translate-x-[-50%] translate-y-[-50%] w-[878px] h-[777px]' scale={[1.64, 1.149, 1]} transform position={[0.007, 3.351, -0.446]} rotation={[0, Math.PI, 0]}>
          {props.children}
        </Html>
      </mesh>
      <KeyboardControls
        map={[
          { name: 'up', keys: ['ArrowUp'] },
          { name: 'down', keys: ['ArrowDown'] },
          { name: 'left', keys: ['ArrowLeft'] },
          { name: 'right', keys: ['ArrowRight'] },
        ]}>
        <Buttons />
      </KeyboardControls>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton1.geometry}
        material={materials.Black}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton2.geometry}
        material={materials.Black}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton3.geometry}
        material={materials.Black}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton4.geometry}
        material={materials.Black}
      />
      <mesh castShadow receiveShadow geometry={nodes.Cube001.geometry} material={darkPlasticMaterial} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001_1.geometry}
        material={materials.Azul}
        ref={bordasFliperama}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001_2.geometry}
        material={materials['Pure Black']}
      />
      <KeyboardControls map={[
        { name: 'up', keys: ['W', 'w'] },
        { name: 'down', keys: ['S', 's'] },
        { name: 'left', keys: ['A', 'a'] },
        { name: 'right', keys: ['D', 'd'] },
      ]}>
        <Joystick />
      </KeyboardControls>
    </group>

  )
};

export default Arcade

useGLTF.preload('models/arcade.glb')