import { useEffect, useRef, useState } from "react";
import { cn, getExternalSound, playSound } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPath, toggleScreenVisibility } from "../../redux/slices/arcadeSlice";
import { IRootState } from "../../redux";
import useThrottle from "../../hooks/use-throttle";

const menuItems = [
    { name: 'GAMES', path: '/games', option: 1 },
    { name: 'OPTIONS', path: '/options', option: 2 },
    { name: 'QUIT', option: 3 },
]

export default function Home() {

    // Component states
    const [currentOption, setCurrentOption] = useState(1);
    const [isTurningOff, setIsTurningOff] = useState(false);

    // Audio states
    const [changeOpSound, setChangeOpSound] = useState<AudioBuffer | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    // Refs
    const homeScreen = useRef<HTMLDivElement | null>(null);

    // Redux
    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)

    // Load sounds
    useEffect(() => {
        getExternalSound({
            setContext: setAudioContext,
            setSoundState: setChangeOpSound,
            audioPath: '/audios/changeOp.mp3'
        });
    }, [])

    // Function to change the current option
    const handleJoystick = useThrottle(() => {
        if (joystickControls.up) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === 1 ? menuItems.length : prev - 1));
        } else if (joystickControls.down) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === menuItems.length ? 1 : prev + 1));
        }
    });

    // Change the current option
    useEffect(() => {
        if (joystickControls.up || joystickControls.down) {
            handleJoystick();
        }
    }, [joystickControls]);

    // Select the current option
    useEffect(() => {
        if (buttonsControls[3]) {
            if (currentOption === 3) {
                exit();
            }
            else {
                dispatch(setPath(menuItems[currentOption - 1].path));
            }
        }

    }, [buttonsControls[3]]);

    // Arcade turn off animation
    const exit = () => {
        setIsTurningOff(true);
        if (homeScreen.current) {
            const screenTurningOff = [
                { height: '100%' },
                { height: '0px' },
            ]
            const screenTurningOffTiming = {
                duration: 500,
                iterations: 1,
                easing: 'ease-in-out',
            }

            homeScreen.current.animate(screenTurningOff, screenTurningOffTiming);
            setTimeout(() => {
                dispatch(setPath('/quit'));
                setIsTurningOff(false);
            }
                , 475);
        }
    }

    return (
        <section className="w-full h-full flex justify-center items-center">
            <menu ref={homeScreen} className={cn("text-black relative bg-background w-full h-full bg-cover overflow-hidden", isTurningOff ? "rounded-[50%]" : "rounded-none")}>
                <nav className="flex justify-center items-center w-auto h-[100%] mt-7">
                    <ul className="flex flex-col justify-center items-center gap-15">
                        {menuItems.map((item, index) => (
                            <li key={index} className={cn("text-7xl font-bold text-white font-byte", currentOption === item.option ? "opacity-100" : "opacity-60")}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </nav>
            </menu>
        </section>
    )
}