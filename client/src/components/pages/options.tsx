import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { cn, getExternalSound, playSound } from "../../lib/utils";
import { setBrightness, setPath, setVolume } from "../../redux/slices/arcadeSlice";
import useThrottle from "../../hooks/use-throttle";

export default function Options() {

    // Component states
    const [currentOption, setCurrentOption] = useState(1);

    // Audio states
    const [changeOpSound, setChangeOpSound] = useState<AudioBuffer | null>(null);
    const [testSound, setTestSound] = useState<AudioBuffer | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    //Redux
    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)
    const arcadeBrightness = useSelector((state: IRootState) => state.arcade[2].brightness)

    // Load sounds
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
    }, []);

    // Function to change the current option
    const handleOptionChange = useThrottle(() => {
        const maxOption = 3;
        if (joystickControls.up) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === 1 ? maxOption : prev - 1));
        } else if (joystickControls.down) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === maxOption ? 1 : prev + 1));
        }
    });

    // Change the current option
    useEffect(() => {
        if (joystickControls.up || joystickControls.down) {
            handleOptionChange();
        }
    }, [joystickControls]);

    // Function to handle the volume and brightness values
    const handleOptionValues = useThrottle(() => {
        if (joystickControls.left) {
            if (currentOption === 2) {
                dispatch(setVolume(arcadeVolume === 0 ? 0 : arcadeVolume! - 1));
            } else if (currentOption === 3) {
                dispatch(setBrightness(arcadeBrightness === 10 ? 10 : arcadeBrightness! - 1));
            }
        } else if (joystickControls.right) {
            if (currentOption === 2) {
                dispatch(setVolume(arcadeVolume === 100 ? 100 : arcadeVolume! + 1));
            } else if (currentOption === 3) {
                dispatch(setBrightness(arcadeBrightness === 100 ? 100 : arcadeBrightness! + 1));
            }
        }
    }, 0);

    // Change the volume and brightness values
    useEffect(() => {
        if (joystickControls.left || joystickControls.right) {
            handleOptionValues();
        }
    }, [joystickControls]);

    // Navigation in the component
    useEffect(() => {
        if (buttonsControls[2]) {
            dispatch(setPath('/'))
        } else if (buttonsControls[3] && currentOption === 1) {
            dispatch(setPath('/options/controls'))
        }

    }, [buttonsControls[2], buttonsControls[3]]);

    // Play test volume sound
    useEffect(() => {
        if (buttonsControls[4] && currentOption === 2) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: testSound
            })
        }
    }, [buttonsControls[4]]);

    return (
        <menu className="relative bg-background w-full h-full">
            <nav className="flex justify-center flex-col items-center w-auto h-[100%] gap-30">
                <span className={cn("text-5xl font-bold text-white font-byte", currentOption === 1 ? "opacity-100" : "opacity-60")}>Controls</span>
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 2 ? "opacity-100" : "opacity-60")}>
                    <span className="text-5xl font-bold text-white font-byte">Volume</span>
                    <input type="range" min="0" max="100" value={arcadeVolume} style={{ '--value': `${arcadeVolume}%` } as CSSProperties & { '--value'?: string }} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
                <p className={cn("text-white text-4xl absolute ml-[64.5%] mt-[4%] px-3.5 py-2 border-2 rounded-lg font-bold font-byte text-center", currentOption === 2 ? "opacity-100" : "opacity-60")}>Test Volume <br /> Bottom Button</p>
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 3 ? "opacity-100" : "opacity-60")}>
                    <span className="text-5xl font-bold text-white font-byte">Brightness</span>
                    <input type="range" min="0" max="100" value={arcadeBrightness} style={{ '--value': `${arcadeBrightness}%` } as CSSProperties & { '--value'?: string }} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
            </nav>
        </menu>
    )
}