import { CSSProperties, useEffect, useRef, useState } from "react";
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

    // Refs
    const isMounted = useRef(false);

    // Redux
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

    // Play test volume sound
    useEffect(() => {
        if (buttonsControls.btnDown && currentOption === 2) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: testSound
            })
        }
    }, [buttonsControls.btnDown]);

    // Navigation in the component
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        } else if (buttonsControls.btnRight) {
            dispatch(setPath('/'))
        } else if (buttonsControls.btnLeft && currentOption === 1) {
            dispatch(setPath('/options/controls'))
        }

    }, [buttonsControls.btnLeft, buttonsControls.btnRight]);

    return (
        <menu className="relative bg-background w-full h-full">
            <nav className="flex justify-center flex-col items-center w-auto h-[100%] gap-30">
                <h2 className={cn("text-5xl font-bold", currentOption === 1 ? "opacity-100" : "opacity-60")}>Controls</h2>
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 2 ? "opacity-100" : "opacity-60")}>
                    <h2 className="text-5xl font-bold">Volume</h2>
                    <input type="range" min="0" max="100" value={arcadeVolume} style={{ '--value': `${arcadeVolume}%` } as CSSProperties & { '--value'?: string }} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
                <p className={cn("text-4xl absolute ml-[64.5%] mt-[4%] px-3.5 py-2 border-2 rounded-lg font-bold text-center", currentOption === 2 ? "opacity-100" : "opacity-60")}>Test Volume <br /> Bottom Button</p>
                <label className={cn("flex flex-col justify-center items-center gap-8", currentOption === 3 ? "opacity-100" : "opacity-60")}>
                    <h2 className="text-5xl font-bold">Brightness</h2>
                    <input type="range" min="0" max="100" value={arcadeBrightness} style={{ '--value': `${arcadeBrightness}%` } as CSSProperties & { '--value'?: string }} className="w-[250px] h-3 bg-white rounded-xs appearance-none cursor-pointer" />
                </label>
            </nav>
        </menu>
    )
}