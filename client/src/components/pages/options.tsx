import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { cn, getExternalSound } from "../../lib/utils";
import { setPath } from "../../redux/slices/arcadeSlice";

export default function Options() {

    const [volumeValue, setVolumeValue] = useState(50);
    const [brightnessValue, setBrightnessValue] = useState(50);
    const [optionsDelay, setOptionsDelay] = useState(false);
    const [rangeDelay, setRangeDelay] = useState(false);
    const [currentOption, setCurrentOption] = useState(1);
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
                setCurrentOption((prev) => (prev === 1 ? 2 : prev - 1));
            } else if (joystickControls.down) {
                playChangeOpSound()
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

    useEffect(() => {
        const handleJoystick = () => {
            if (joystickControls.left) {
                if (currentOption === 1) {
                    setVolumeValue((prev) => (prev === 0 ? 0 : prev - 1));
                } else if (currentOption === 2) {
                    setBrightnessValue((prev) => (prev === 0 ? 0 : prev - 1));
                }
            } else if (joystickControls.right) {
                if (currentOption === 1) {
                    setVolumeValue((prev) => (prev === 100 ? 100 : prev + 1));
                } else if (currentOption === 2) {
                    setBrightnessValue((prev) => (prev === 100 ? 100 : prev + 1));
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

    // Selecionar a opção atual
    useEffect(() => {
        if (buttonsControls[2]) {
            dispatch(setPath('/'))
        }

    }, [buttonsControls[2]]);

    return (
        <menu className="text-black relative bg-background w-full h-full bg-cover overflow-hidden">
            <nav className="flex justify-center flex-col items-center w-auto h-[100%] gap-30">
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 1 ? "opacity-100" : "opacity-70")}>
                    <span className="text-5xl font-bold text-white font-byte">Volume</span>
                    <input type="range" min="0" max="100" value={volumeValue} style={{ '--value': `${volumeValue}%` } as CSSProperties & { '--value'?: string }} onChange={(e) => setVolumeValue(Number(e.target.value))} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 2 ? "opacity-100" : "opacity-70")}>
                    <span className="text-5xl font-bold text-white font-byte">Brightness</span>
                    <input type="range" min="0" max="100" value={brightnessValue} style={{ '--value': `${brightnessValue}%` } as CSSProperties & { '--value'?: string }} onChange={(e) => setBrightnessValue(Number(e.target.value))} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
                <p className={cn("text-white text-4xl absolute ml-[64.5%] mb-[15%] px-3.5 py-2 border-2 rounded-lg font-bold font-byte text-center", currentOption === 1 ? "opacity-100" : "opacity-70")}>Test Volume <br /> Bottom Button</p>
            </nav>
        </menu>
    )
}