import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { setPath } from "../../redux/slices/arcadeSlice";
import useThrottle from "../../hooks/use-throttle";
import { cn, getExternalSound, playSound } from "../../lib/utils";
import { setBinds } from "../../redux/slices/controlsSlice";

export default function Binds() {

    // Redux
    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)
    const controlsBinds = useSelector((state: IRootState) => state.controls[2])

    // Audio states
    const [changeOpSound, setChangeOpSound] = useState<AudioBuffer | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    // Component states
    const [currentOption, setCurrentOption] = useState(1);
    const [allBinds, setAllbinds] = useState<string[]>([]);
    const [bindsState, setBindsState] = useState({
        joystick: [
            { name: 'Up', key: controlsBinds.up as string[] },
            { name: 'Down', key: controlsBinds.down as string[] },
            { name: 'Left', key: controlsBinds.left as string[] },
            { name: 'Right', key: controlsBinds.right as string[] },
        ],
        buttons: [
            { name: 'Up', key: controlsBinds.btnUp as string[] },
            { name: 'Down', key: controlsBinds.btnDown as string[] },
            { name: 'Left', key: controlsBinds.btnLeft as string[] },
            { name: 'Right', key: controlsBinds.btnRight as string[] },
        ]
    });
    const [userInput, setUserInput] = useState<number | null>(null);
    const [controlsDisabled, setControlsDisabled] = useState(false);

    // Refs
    const isMounted = useRef(false);
    const userInputValue = useRef<number | null>(null);
    const allBindsRef = useRef<string[]>([]);

    const h2Style = "text-5xl font-bold pb-2";
    const bindsStyle = "text-[2.5rem] leading-10 text-white opacity-60";

    // Function to set the allBinds state
    const fillAllBinds = () => {
        let bindsArr: string[] = []
        Object.keys(bindsState).forEach((key) => {
            bindsState[key as keyof typeof bindsState].forEach((bind) => {
                bindsArr.push(`${key} ${bind.key![0]}`);
            })
        })
        setAllbinds(bindsArr)
    }

    // Set the allBinds state
    useEffect(() => {
        fillAllBinds();
    }, [])

    // Load sounds
    useEffect(() => {
        getExternalSound({
            setContext: setAudioContext,
            setSoundState: setChangeOpSound,
            audioPath: '/audios/changeOp.mp3'
        });
    }, [])

    // Function to change the current option
    const handleOptionChange = useThrottle(() => {
        if (controlsDisabled) return;
        if (joystickControls.up) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === 1 ? allBinds.length : prev - 1));
        } else if (joystickControls.down) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === allBinds.length ? 1 : prev + 1));
        }
    });

    // Change the current option
    useEffect(() => {
        if (joystickControls.up || joystickControls.down) {
            handleOptionChange();
        }
    }, [joystickControls]);

    // Enter the change binds mode
    useEffect(() => {
        if (!isMounted.current) return;
        // Joystick binds
        if (currentOption < bindsState.joystick.length + 1 && buttonsControls.btnLeft && Object.keys(controlsBinds).length === allBinds.length) {
            // Remove the element from the allBinds state
            const element = allBinds.filter((b) => b === `joystick ${(bindsState.joystick[currentOption - 1] as unknown as Record<string, string[]>).key[0]}`)[0]
            const newArray = [...allBinds.slice(0, currentOption - 1), ...allBinds.slice(currentOption)];
            const index = allBinds.indexOf(element);
            setAllbinds(newArray);
            // Set the user input state as the right index
            setUserInput(index)
            setControlsDisabled(true)
        } // Buttons binds
        else if (currentOption > bindsState.joystick.length && currentOption < bindsState.joystick.length + bindsState.buttons.length + 1 && buttonsControls.btnLeft && Object.keys(controlsBinds).length === allBinds.length) {
            // Remove the element from the allBinds state
            const element = allBinds.filter((b) => b === `buttons ${(bindsState.buttons[currentOption - 5] as unknown as Record<string, string[]>).key[0]}`)[0]
            const newArray = [...allBinds.slice(0, currentOption - 1), ...allBinds.slice(currentOption)];
            const index = allBinds.indexOf(element);
            setAllbinds(newArray);
            // Set the user input state as the right index
            setUserInput(index)
            setControlsDisabled(true)
        }
    }, [buttonsControls.btnLeft])

    // Function to update the binds state
    const handleUserInput = useCallback((e: KeyboardEvent) => {
        // Get the key in the correct format
        const key = e.key;
        let variableKey
        if (/^[a-zA-Z]$/.test(key)) {
            key === key.toUpperCase() ? variableKey = key.toLowerCase() : variableKey = key.toUpperCase()
        }
        const inputArray = variableKey ? key === key.toLowerCase() ? [variableKey, key] : [key, variableKey] : [key]

        // Check if the key is already in the binds
        const includesInBinds = () => {
            const arrayOfAllKeys = allBindsRef.current.map((b) => b.split(' ')[1])
            return arrayOfAllKeys.some((b) => b === inputArray[0]) || arrayOfAllKeys.some((b) => b === inputArray[0])
        }
        if (includesInBinds()) return;

        // Set the component states related to the binds
        setAllbinds((prev) => {
            const newArray = [...prev];
            newArray.splice(userInputValue.current!, 0, `${userInputValue.current! < bindsState.joystick.length ? 'joystick' : 'buttons'} ${inputArray[0]}`);
            return newArray;
        })
        setBindsState((prev) => {
            const newObj = { ...prev };
            if (userInputValue.current! <= bindsState.joystick.length - 1) {
                newObj.joystick[userInputValue.current!].key = inputArray;
            } else {
                newObj.buttons[userInputValue.current! - bindsState.joystick.length].key = inputArray;
            }
            return newObj;
        })

        // Get out of the change binds mode
        setUserInput(null)
        setTimeout(() => setControlsDisabled(false), 300)
    }, [])

    // Capture the user input in case the user interacted with the button 3 in some bind
    useEffect(() => {
        userInputValue.current = userInput
        if (userInput !== null) {
            window.addEventListener('keydown', handleUserInput)
        } else if (userInput === null) {
            window.removeEventListener('keydown', handleUserInput)
        }
    }, [userInput])

    // Update allBindsRef with the current state to be able to use it in the callback
    useEffect(() => {
        allBindsRef.current = allBinds
    }, [allBinds])


    // Update the binds state in the redux store and local storage
    useEffect(() => {
        if (!isMounted.current) return;
        dispatch(setBinds({
            up: bindsState.joystick[0].key,
            down: bindsState.joystick[1].key,
            left: bindsState.joystick[2].key,
            right: bindsState.joystick[3].key,
            btnUp: bindsState.buttons[0].key,
            btnDown: bindsState.buttons[1].key,
            btnRight: bindsState.buttons[3].key,
            btnLeft: bindsState.buttons[2].key
        }))
        localStorage.setItem('arcadeBinds', JSON.stringify({
            up: bindsState.joystick[0].key,
            down: bindsState.joystick[1].key,
            left: bindsState.joystick[2].key,
            right: bindsState.joystick[3].key,
            btnUp: bindsState.buttons[0].key,
            btnDown: bindsState.buttons[1].key,
            btnRight: bindsState.buttons[3].key,
            btnLeft: bindsState.buttons[2].key
        }))
    }, [bindsState])

    // Go back to options and cancel changing binds
    useEffect(() => {
        // Cancel changing binds
        if (controlsDisabled && buttonsControls.btnRight) {
            fillAllBinds();
            setUserInput(null);
            setControlsDisabled(false);
            return
        };
        // Go back to options
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        } else if (buttonsControls.btnRight && !controlsDisabled) {
            dispatch(setPath('/options'))
        }
    }, [buttonsControls.btnRight]);

    return (
        <div className="w-full h-full p-12 bg-background">
            <h1 className="text-6xl w-full h-[10%] text-center font-bold">Rebind controls</h1>
            <div className="w-full h-[90%] flex flex-col items-start justify-evenly pl-[2%]">
                <div>
                    <h2 className={h2Style}>Joystick:</h2>
                    {
                        bindsState.joystick.map((bind, index) => (
                            <div key={index} className={cn(bindsStyle, currentOption === index + 1 ? 'opacity-100' : 'opacity-60')}>
                                {`${bind.name}:${allBinds.filter((b) => b === `joystick ${(bind.key! as unknown as Record<string, string[]>)[0]}`).length !== 0 ? (bind.key! as unknown as Record<string, string[]>)[0] : 'Click any character to set'}`}
                            </div>
                        ))
                    }
                </div>
                <div>
                    <h2 className={h2Style}>Buttons:</h2>
                    {
                        bindsState.buttons.map((bind, index) => (
                            <div key={index} className={cn(bindsStyle, currentOption === index + bindsState.joystick.length + 1 ? 'opacity-100' : 'opacity-60')}>
                                {`${bind.name}:${allBinds.filter((b) => b === `buttons ${(bind.key! as unknown as Record<string, string[]>)[0]}`).length !== 0 ? (bind.key! as unknown as Record<string, string[]>)[0] : 'Click any character to set'}`}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}