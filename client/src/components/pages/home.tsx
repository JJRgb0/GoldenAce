import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPath } from "../../redux/slices/arcadeSlice";
import { IRootState } from "../../redux";

const menuItems = [
    { name: 'GAMES', link: '/games', option: 1 },
    { name: 'OPTIONS', link: '/options', option: 2 },
    { name: 'QUIT', link: undefined, option: 3 },
]

export default function Home() {
    const [currentOption, setCurrentOption] = useState(1);
    const [delay, setDelay] = useState(false);
    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])

    useEffect(() => {
        const handleJoystick = () => {
            if (joystickControls.up) {
                setCurrentOption((prev) => (prev === 1 ? menuItems.length : prev - 1));
            } else if (joystickControls.down) {
                setCurrentOption((prev) => (prev === menuItems.length ? 1 : prev + 1));
            }
            setDelay(true);
            setTimeout(() => {
                setDelay(false);
            }
                , 300);
        };

        if (delay) return;
        handleJoystick();
    })
    useEffect(() => {
        if (buttonsControls[3]) {
            dispatch(setPath(menuItems[currentOption - 1].link));
        }

    }, [buttonsControls[3]]);

    return (
        <div className="text-black relative bg-[#050505] w-[100%] h-[100%] bg-cover overflow-hidden">
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