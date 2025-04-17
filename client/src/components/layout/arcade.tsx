
import { JSX, useRef, useState } from 'react'
import { Html, KeyboardControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import Joystick from './joystick';
import Buttons from './buttons';
import { darkPlasticMaterial, grayPlasticMaterial, neonOffMaterial, screenMaterial } from '../../lib/materials';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux';

const Arcade = (props: JSX.IntrinsicElements['group']) => {

  const { nodes, materials } = useGLTF('models/arcade.glb') as unknown as
    {
      nodes: Record<string, any>,
      materials: Record<string, any>
    }

  const screenVisible = useSelector((state: IRootState) => state.arcade[0].screenVisible);
  const arcadeBrightness = useSelector((state: IRootState) => state.arcade[2].brightness);

  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0.1);
  const [emissiveLightness, setEmissiveLightness] = useState(0);

  const getCycleColorAnimation = (t: number) => {
    if (screenVisible) {
      setHue(0.5 + (Math.sin(t * 0.2) * 0.5 + 0.5) * 0.3)
      if (saturation < 0.8) {
        setSaturation((prev) => prev + 0.005);
      }
      if (lightness < 0.5) {
        setLightness((prev) => prev + 0.005);
      }
      if (emissiveLightness < 0.5) {
        setEmissiveLightness((prev) => prev + 0.001);
      }
    }
    if (!screenVisible) {
      if (hue > 0.5) {
        setHue((prev) => prev - 0.005);
      }
      else if (hue === 0.5) {
        setHue(0);
      }
      if (saturation > 0) {
        setSaturation((prev) => prev - 0.005);
      }
      if (lightness > 0.1) {
        setLightness((prev) => prev - 0.005);
      }
      if (emissiveLightness > 0) {
        setEmissiveLightness((prev) => prev - 0.005);
      }
    }
  };

  useFrame((state) => {

    const t = state.clock.elapsedTime
    getCycleColorAnimation(t);

    neonOffMaterial.color.set(new THREE.Color().setHSL(hue, saturation, lightness));
    neonOffMaterial.emissive.set(new THREE.Color().setHSL(hue, saturation, emissiveLightness));

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
        material={neonOffMaterial}
      />
      <mesh castShadow receiveShadow geometry={nodes.Screen.geometry} material={screenMaterial} >
        {/* Conteúdo da tela do fliperama */}
        <Html occlude="blending" receiveShadow visible={screenVisible} distanceFactor={0.456} center className={`tela filter-[contrast(1.3)_brightness(${arcadeBrightness! / 50})_saturate(0.7)_sepia(0.1)_blur(0.2)] absolute cursor-default pointer-events-none translate-x-[-50%] translate-y-[-50%] w-[878px] h-[777px]`} scale={[1.64, 1.149, 1]} transform position={[0.007, 3.351, -0.446]} rotation={[0, Math.PI, 0]}>
          {props.children}
        </Html>
      </mesh>
      <KeyboardControls
        map={[
          { name: 'up', keys: ['I', 'i'] },
          { name: 'down', keys: ['K', 'k'] },
          { name: 'left', keys: ['J', 'j'] },
          { name: 'right', keys: ['L', 'l'] },
        ]}>
        <Buttons />
      </KeyboardControls>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton1.geometry}
        material={grayPlasticMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton2.geometry}
        material={grayPlasticMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton3.geometry}
        material={grayPlasticMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BaseButton4.geometry}
        material={grayPlasticMaterial}
      />
      <mesh castShadow receiveShadow geometry={nodes.Cube001.geometry} material={darkPlasticMaterial} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001_1.geometry}
        material={neonOffMaterial}
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