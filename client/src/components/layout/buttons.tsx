import { useGLTF, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RefObject, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { redPlasticMaterial } from "../../lib/materials"
import { useDispatch, useSelector } from "react-redux"
import { IRootState } from "../../redux"
import { setPath, toggleScreenVisibility } from "../../redux/slices/arcadeSlice";
import { setButtons } from "../../redux/slices/controlsSlice"

export default function Buttons() {

    const { nodes } = useGLTF('models/arcade.glb') as unknown as
        {
            nodes: Record<string, any>,
        }

    // Audio context
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [buttonClickSound, setButtonClickSound] = useState<AudioBuffer | null>(null);

    // Inicializar o AudioContext e carregar o som dos botões
    useEffect(() => {
        const ctx = new AudioContext()
        setAudioContext(ctx);

        // Carregar o som
        const loadSound = async () => {
            try {
                const response = await fetch('/audios/button.mp3');
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                setButtonClickSound(audioBuffer);
            } catch (error) {
                console.error('Erro ao carregar o som:', error);
            }
        };
        loadSound();

        // Fechar o AudioContext ao desmontar o componente
        return () => {
            ctx.close();
        };
    }, []);

    // Função para tocar o som dos botões
    const playSound = () => {
        if (audioContext && buttonClickSound) {
            const source = audioContext.createBufferSource();
            source.buffer = buttonClickSound;
            source.connect(audioContext.destination);
            source.start(0);
        }
    };

    // Redux
    const dispatch = useDispatch();
    const screenVisible = useSelector((state: IRootState) => state.arcade[0].screenVisible);
    const visible = useSelector((state: IRootState) => state.arcade[0].arcadeVisible);

    // Refs
    const buttonRefs = {
        button1: useRef<THREE.Mesh>(null),
        button2: useRef<THREE.Mesh>(null),
        button3: useRef<THREE.Mesh>(null),
        button4: useRef<THREE.Mesh>(null),
    }

    // States
    const [buttonStates, setButtonStates] = useState({
        isButton1Pressed: false,
        isButton2Pressed: false,
        isButton3Pressed: false,
        isButton4Pressed: false
    });
    const [counters, setCounters] = useState({
        up: 0,
        down: 0,
        left: 0,
        right: 0
    })
    const [screenCounter, setScreenCounter] = useState(0);

    // Keyboard controls
    const [, get] = useKeyboardControls()

    // Button handlers
    const onButtonDown = (buttonRef: RefObject<THREE.Mesh | null>) => {
        if (!buttonRef.current || !visible) return
        const button = buttonRef.current
        const i = button.name
        dispatch(setButtons({
            [i]: true,
        }))
        if (buttonRef) {
            button.position.set(0, -0.02, 0)
            setButtonStates((prevState) => ({
                ...prevState,
                [`isButton${i}Pressed`]: true
            }));
            playSound();
        }
    }
    const onButtonUp = (buttonRef: RefObject<THREE.Mesh | null>) => {
        if (!buttonRef.current || !visible) return
        const button = buttonRef.current
        const i = button.name
        dispatch(setButtons({
            [i]: false,
        }))
        if (button === buttonRefs.button2.current || button === buttonRefs.button3.current) {
            setScreenCounter(0);
        }
        if (buttonRef) {
            button.position.set(0, 0, 0)
            setButtonStates((prevState) => ({
                ...prevState,
                [`isButton${i}Pressed`]: false
            }))
        }
    }

    useFrame(() => {
        const { up, down, left, right } = get()
        if (up && !counters.up) {
            onButtonDown(buttonRefs.button1)
            setCounters((prevState) => ({
                ...prevState,
                up: 1
            }))
        }
        if (!up && counters.up == 1) {
            onButtonUp(buttonRefs.button1)
            setCounters((prevState) => ({
                ...prevState,
                up: 0
            }))
        }
        if (down && !counters.down) {
            onButtonDown(buttonRefs.button4)
            setCounters((prevState) => ({
                ...prevState,
                down: 1
            }))
        }
        if (!down && counters.down == 1) {
            onButtonUp(buttonRefs.button4)
            setCounters((prevState) => ({
                ...prevState,
                down: 0
            }))
        }
        if (left && !counters.left) {
            onButtonDown(buttonRefs.button3)
            setCounters((prevState) => ({
                ...prevState,
                left: 1
            }))
        }
        if (!left && counters.left == 1) {
            onButtonUp(buttonRefs.button3)
            setCounters((prevState) => ({
                ...prevState,
                left: 0
            }))
        }
        if (right && !counters.right) {
            onButtonDown(buttonRefs.button2)
            setCounters((prevState) => ({
                ...prevState,
                right: 1
            }))
        }
        if (!right && counters.right == 1) {
            onButtonUp(buttonRefs.button2)
            setCounters((prevState) => ({
                ...prevState,
                right: 0
            }))
        }

        if (buttonStates.isButton2Pressed && buttonStates.isButton3Pressed && !screenVisible) {
            if (screenCounter < 120) {
                setScreenCounter((prev) => prev + 1);
            }
            else {
                dispatch(toggleScreenVisibility(true));
                dispatch(setPath('/entrace'))
            }
        }
    })

    return (
        <>
            {Object.keys(buttonRefs).map((key, index) => {

                const button = buttonRefs[key as keyof typeof buttonRefs]

                return (
                    <mesh
                        castShadow
                        key={key}
                        name={`${index + 1}`}
                        onPointerDown={() => onButtonDown(button)}
                        onPointerUp={() => onButtonUp(button)}
                        onPointerOut={() => onButtonUp(button)}
                        onPointerMissed={() => onButtonUp(button)}
                        ref={button}
                        receiveShadow
                        geometry={nodes[`Button${index + 1}`].geometry}
                        material={redPlasticMaterial}
                    />
                )
            })}
        </>
    )
}

useGLTF.preload('models/arcade.glb')