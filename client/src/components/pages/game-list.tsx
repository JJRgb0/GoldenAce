import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { setPath } from "../../redux/slices/arcadeSlice";
import { getExternalSound, playSound } from "../../lib/utils";
import useThrottle from "../../hooks/use-throttle";

const games = [
    { name: 'Snake', path: '/snake' },
    { name: 'Tetris', path: '/tetris' },
    { name: 'Pacman', path: '/pacman' },
    { name: 'Doom', path: '/doom' },
]

export default function GameList() {

    // Audio states
    const [changeOpSound, setChangeOpSound] = useState<AudioBuffer | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    // Component states
    const [currentOption, setCurrentOption] = useState(1);
    const [divIndex, setDivIndex] = useState(1);
    const [side, setSide] = useState<'left' | 'right' | undefined>(undefined);

    // Redux
    const dispatch = useDispatch();
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)
    const joystickControls = useSelector((state: IRootState) => state.controls[0])

    // Refs
    const wrapper = useRef<HTMLDivElement>(null);

    const sideOpStyle = "w-[137.5px] duration-350 absolute border-4 bg-blue-500 border-white rounded-md h-[275px] text-4xl text-white font-byte flex justify-center items-center";
    const mainOpStyle = "w-[275px] duration-350 absolute border-4 bg-red-500 border-white rounded-md h-[550px] text-7xl text-white font-byte flex justify-center items-center";

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
        if (joystickControls.left) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === 1 ? games.length : prev - 1));
            setDivIndex((prev) => (prev === 1 ? 3 : prev - 1));
            setSide('left');
        } else if (joystickControls.right) {
            playSound({
                volume: arcadeVolume!,
                audioContext: audioContext,
                sound: changeOpSound
            })
            setCurrentOption((prev) => (prev === games.length ? 1 : prev + 1));
            setDivIndex((prev) => (prev === 3 ? 1 : prev + 1));
            setSide('right');
        }
    }, 350);

    // Change current option
    useEffect(() => {
        if (joystickControls.left || joystickControls.right) {
            handleOptionChange();
        }
    }, [joystickControls]);

    // Go back to main menu
    useEffect(() => {
        if (buttonsControls[2]) {
            dispatch(setPath('/'))
        }

    }, [buttonsControls[2]]);

    // Update and animate options in carousel format
    useEffect(() => {
        // Update the content of the options
        if (wrapper.current) {
            if (divIndex === 1) {
                if (side === 'left') {
                    setTimeout(() => {
                        wrapper.current!.children[0].innerHTML = (games.filter((game) => (currentOption === 1 ? game === games[games.length - 1] : game === games[currentOption - 2])))[0].name;
                    }, 175)
                }
                else {
                    wrapper.current.children[0].innerHTML = (games.filter((game) => (currentOption === 1 ? game === games[games.length - 1] : game === games[currentOption - 2])))[0].name;
                }
                wrapper.current.children[1].innerHTML = (games.filter((game) => (game === games[currentOption - 1])))[0].name;
                if (side === 'right') {
                    setTimeout(() => {
                        wrapper.current!.children[2].innerHTML = (games.filter((game) => (currentOption === games.length ? games[0] : game === games[currentOption])))[0].name;
                    }, 175)
                }
                else {
                    wrapper.current.children[2].innerHTML = (games.filter((game) => (currentOption === games.length ? games[0] : game === games[currentOption])))[0].name;
                }
            }
            else if (divIndex === 2) {
                if (side === 'right') {
                    setTimeout(() => {
                        wrapper.current!.children[0].innerHTML = (games.filter((game) => (currentOption === games.length ? games[0] : game === games[currentOption])))[0].name;
                    }, 175)
                }
                else {
                    wrapper.current.children[0].innerHTML = (games.filter((game) => (currentOption === games.length ? games[0] : game === games[currentOption])))[0].name;
                }
                if (side === 'left') {
                    setTimeout(() => {
                        wrapper.current!.children[1].innerHTML = (games.filter((game) => (currentOption === 1 ? game === games[games.length - 1] : game === games[currentOption - 2])))[0].name;
                    }, 175)
                }
                else {
                    wrapper.current.children[1].innerHTML = (games.filter((game) => (currentOption === 1 ? game === games[games.length - 1] : game === games[currentOption - 2])))[0].name;
                }
                wrapper.current.children[2].innerHTML = (games.filter((game) => (game === games[currentOption - 1])))[0].name;
            }
            else if (divIndex === 3) {
                wrapper.current.children[0].innerHTML = (games.filter((game) => (game === games[currentOption - 1])))[0].name;
                if (side === 'right') {
                    setTimeout(() => {
                        wrapper.current!.children[1].innerHTML = (games.filter((game) => (currentOption === games.length ? games[0] : game === games[currentOption])))[0].name;
                    }, 175)
                }
                else {
                    wrapper.current.children[1].innerHTML = (games.filter((game) => (currentOption === games.length ? games[0] : game === games[currentOption])))[0].name;
                }
                if (side === 'left') {
                    setTimeout(() => {
                        wrapper.current!.children[2].innerHTML = (games.filter((game) => (currentOption === 1 ? game === games[games.length - 1] : game === games[currentOption - 2])))[0].name;
                    }, 175)
                }
                else {
                    wrapper.current!.children[2].innerHTML = (games.filter((game) => (currentOption === 1 ? game === games[games.length - 1] : game === games[currentOption - 2])))[0].name;
                }
            }

            // Carousel animation
            if (divIndex === (side !== undefined ? 3 : null)) {
                wrapper.current.children[0].setAttribute('class', `${mainOpStyle} translate-x-0 z-2`)
                wrapper.current.children[1].setAttribute('class', `${sideOpStyle} translate-x-[250px] ${side === 'left' ? 'z-2' : ''}`)
                wrapper.current.children[2].setAttribute('class', `${sideOpStyle} translate-x-[-250px] ${side === 'left' ? '' : 'z-2'}`)
            } else if (divIndex === (side !== undefined ? 1 : null)) {
                wrapper.current.children[0].setAttribute('class', `${sideOpStyle} translate-x-[-250px] ${side === 'left' ? '' : 'z-2'}`)
                wrapper.current.children[1].setAttribute('class', `${mainOpStyle} translate-x-0 z-2`)
                wrapper.current.children[2].setAttribute('class', `${sideOpStyle} translate-x-[250px] ${side === 'left' ? 'z-2' : ''}`)
            } else if (divIndex === (side !== undefined ? 2 : null)) {
                wrapper.current.children[0].setAttribute('class', `${sideOpStyle} translate-x-[250px] ${side === 'left' ? 'z-2' : ''}`)
                wrapper.current.children[1].setAttribute('class', `${sideOpStyle} translate-x-[-250px] ${side === 'left' ? '' : 'z-2'}`)
                wrapper.current.children[2].setAttribute('class', `${mainOpStyle} translate-x-[0px] z-2`)
            }
        }
    }, [divIndex])

    return (
        <main className="w-full h-full bg-background relative flex justify-center items-center flex-col gap-10">
            <h1 className="text-white text-7xl font-bold font-byte">Game List</h1>
            <div ref={wrapper} className="w-[70%] h-[75%] flex justify-center items-center">
                <div className={`${sideOpStyle} translate-x-[-250px]`} />
                <div className={`${mainOpStyle} translate-x-0`} />
                <div className={`${sideOpStyle} translate-x-[250px]`} />
            </div>
        </main>
    )
}