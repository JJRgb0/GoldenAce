import { useEffect, useState } from "react";
import { cn, getExternalSound } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPath, toggleScreenVisibility } from "../../redux/slices/arcadeSlice";
import { IRootState } from "../../redux";

const menuItems = [
    { name: 'GAMES', link: '/games', option: 1 },
    { name: 'OPTIONS', link: '/options', option: 2 },
    { name: 'QUIT', option: 3 },
]

export default function Home() {
    const [currentOption, setCurrentOption] = useState(1);
    const [optionsDelay, setOptionsDelay] = useState(false);
    const [isTurningOff, setIsTurningOff] = useState(false);
    const [changeOpSound, setChangeOpSound] = useState<AudioBuffer | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])

    // Carregar o som de mudança de opção
    useEffect(() => {
        getExternalSound({
            setContext: setAudioContext,
            setSoundState: setChangeOpSound,
            audioPath: '/audios/changeOp.mp3'
        });
    }, [])

    // Tocar o som de mudança de opção
    const playChangeOpSound = () => {
        if (audioContext && changeOpSound) {
            const source = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(audioContext.destination);
            source.buffer = changeOpSound;
            source.connect(gainNode);
            source.start(0);
        }
    };

    // Mudar a opção atual
    useEffect(() => {
        const handleJoystick = () => {
            if (joystickControls.up) {
                playChangeOpSound()
                setCurrentOption((prev) => (prev === 1 ? menuItems.length : prev - 1));
            } else if (joystickControls.down) {
                playChangeOpSound()
                setCurrentOption((prev) => (prev === menuItems.length ? 1 : prev + 1));
            }
            setOptionsDelay(true);
            setTimeout(() => {
                setOptionsDelay(false);
            }
                , 300);
        };

        if (optionsDelay) return;
        handleJoystick();
    })

    // Selecionar a opção atual
    useEffect(() => {
        if (buttonsControls[3]) {
            if (currentOption === 3) {
                exit();
            }
            else {
                dispatch(setPath(menuItems[currentOption - 1].link));
            }
        }

    }, [buttonsControls[3]]);

    // Animação de desligar
    const exit = () => {
        setIsTurningOff(true);
        const tela = document.querySelector('.tela') as HTMLDivElement;
        if (tela) {
            const screenTurningOff = [
                { width: '878px', height: '777px' },
                { width: '0px', height: '0px' },
            ]
            const screenTurningOffTiming = {
                duration: 500,
                iterations: 1,
                easing: 'ease-in-out',
            }

            tela.animate(screenTurningOff, screenTurningOffTiming);
            setTimeout(() => {
                setIsTurningOff(false);
                dispatch(setPath('/quit'));
            }
                , 475);
        }
    }

    return (
        <div className={cn("text-black relative bg-[#050505] w-[100%] h-[100%] bg-cover overflow-hidden", isTurningOff ? "rounded-full" : "rounded-none")}>
            <nav className="flex justify-center items-center w-auto h-[100%] mt-7">
                <ul className="flex flex-col justify-center items-center gap-15">
                    {menuItems.map((item, index) => (
                        <li key={index} className={cn("text-7xl font-bold text-white font-byte", currentOption === item.option ? "" : "text-gray-400")}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}