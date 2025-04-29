import { Dispatch, useState } from "react";
import { SetStateAction } from "react";
import { cn } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { toggleVisibility } from "../../redux/slices/arcadeSlice";

export default function Manual({ setView }: { setView: Dispatch<SetStateAction<boolean>> }) {

    // Component states
    const [animation, setAnimation] = useState<boolean>(false);

    // Redux
    const dispatch = useDispatch();

    // Function to handle the manual closing with delay
    const handleClick = () => {
        setAnimation(true);
        dispatch(toggleVisibility(true));
        setTimeout(() => {
            setView(false);
        }
            , 2000);
    }

    return (
        <div className={cn("fixed top-0 left-0 inset-0 z-1000 w-full h-screen bg-black flex justify-center items-center duration-2000 font-raleway", !animation ? "opacity-100" : "opacity-0")}>
            <div className="sm:w-[80%] w-[90%] h-full flex flex-col gap-5 justify-center items-start">
                <p className="sm:text-sm text-xs opacity-80 italic mb-[-15px] before:content-['|'] before:pr-1">This experience was developed to run on desktop devices</p>
                <h1 className="sm:text-2xl text-xl font-bold italic">
                    To turn on the arcade press and hold the left and right button at the same time
                </h1>
                <h2 className="sm:text-lg text-sm opacity-80">
                    Joystick: W A S D
                    <br />
                    Buttons: I J K L
                    <br />
                    <span className="sm:text-base text-xs italic">&#40;Or you can press it manually&#41;</span>
                </h2>
                <button onClick={handleClick} className="text-black sm:text-xl text-lg shadow-[5px_7px_2px_#423b3b] uppercase font-bold bg-white sm:px-3 px-2.5 sm:py-1.5 py-1 rounded-md cursor-pointer hover:scale-90 duration-200">I get it</button>
            </div>
        </div>
    )
}