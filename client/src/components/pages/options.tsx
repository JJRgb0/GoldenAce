import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { cn, getExternalSound, playSound } from "../../lib/utils";
import { setBrightness, setPath, setVolume } from "../../redux/slices/arcadeSlice";

export default function Options() {

    const [optionsDelay, setOptionsDelay] = useState(false);
    const [rangeDelay, setRangeDelay] = useState(false);
    const [currentOption, setCurrentOption] = useState(1);
    const [changeOpSound, setChangeOpSound] = useState<AudioBuffer | null>(null);
    const [testSound, setTestSound] = useState<AudioBuffer | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)
    const arcadeBrightness = useSelector((state: IRootState) => state.arcade[2].brightness)

    // Carregar os sons
    useEffect(() => {
        getExternalSound({
            setContext: setAudioContext,
            setSoundState: setChangeOpSound,
            audioPath: '/audios/changeOp.mp3'
        });
        getExternalSound({
            setContext: setAudioContext,
            setSoundState: setTestSound,
            audioPath: '/audios/testVolume.mp3'
        });
    }, [])

    // Mudar a opção atual
    useEffect(() => {
        const handleJoystick = () => {
            if (joystickControls.up) {
                playSound({
                    volume: arcadeVolume!,
                    audioContext: audioContext,
                    sound: changeOpSound
                })
                setCurrentOption((prev) => (prev === 1 ? 2 : prev - 1));
            } else if (joystickControls.down) {
                playSound({
                    volume: arcadeVolume!,
                    audioContext: audioContext,
                    sound: changeOpSound
                })
                setCurrentOption((prev) => (prev === 2 ? 1 : prev + 1));
            }
            setOptionsDelay(true);
            setTimeout(() => {
                setOptionsDelay(false);
            }
                , 300);
        };

        if (optionsDelay) return;
        handleJoystick();
    }, [joystickControls, optionsDelay]);

    // Mudar o volume e o brilho
    useEffect(() => {
        const handleJoystick = () => {
            if (joystickControls.left) {
                if (currentOption === 1) {
                    dispatch(setVolume(arcadeVolume === 0 ? 0 : arcadeVolume! - 1));
                } else if (currentOption === 2) {
                    dispatch(setBrightness(arcadeBrightness === 0 ? 0 : arcadeBrightness! - 1));
                }
            } else if (joystickControls.right) {
                if (currentOption === 1) {
                    dispatch(setVolume(arcadeVolume === 100 ? 100 : arcadeVolume! + 1));
                } else if (currentOption === 2) {
                    dispatch(setBrightness(arcadeBrightness === 100 ? 100 : arcadeBrightness! + 1));
                }
            }
            setRangeDelay(true);
            setTimeout(() => {
                setRangeDelay(false);
            }
                , 25);
        }
        if (rangeDelay) return;
        handleJoystick();
    }, [joystickControls, rangeDelay]);

    // Voltar para o menu principal
    useEffect(() => {
        if (buttonsControls[2]) {
            dispatch(setPath('/'))
        }

    }, [buttonsControls[2]]);

    // Tocar som de teste de volume
    useEffect(() => {
        if (buttonsControls[4] && currentOption === 1) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: testSound
            })
        }
    }, [buttonsControls[4]])

    return (
        <menu className="text-black relative bg-background w-full h-full bg-cover overflow-hidden">
            <nav className="flex justify-center flex-col items-center w-auto h-[100%] gap-30">
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 1 ? "opacity-100" : "opacity-70")}>
                    <span className="text-5xl font-bold text-white font-byte">Volume</span>
                    <input type="range" min="0" max="100" value={arcadeVolume} style={{ '--value': `${arcadeVolume}%` } as CSSProperties & { '--value'?: string }} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 2 ? "opacity-100" : "opacity-70")}>
                    <span className="text-5xl font-bold text-white font-byte">Brightness</span>
                    <input type="range" min="0" max="100" value={arcadeBrightness} style={{ '--value': `${arcadeBrightness}%` } as CSSProperties & { '--value'?: string }} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
                <p className={cn("text-white text-4xl absolute ml-[64.5%] mb-[15%] px-3.5 py-2 border-2 rounded-lg font-bold font-byte text-center", currentOption === 1 ? "opacity-100" : "opacity-70")}>Test Volume <br /> Bottom Button</p>
            </nav>
        </menu>
    )
}