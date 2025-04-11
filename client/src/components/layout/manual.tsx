import { Dispatch, useState } from "react";
import { SetStateAction } from "react";
import { cn } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { toggleVisibility } from "../../redux/slices/arcadeSlice";

export default function Manual({ setView }: { setView: Dispatch<SetStateAction<boolean>> }) {

    const [animation, setAnimation] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleClick = () => {
        setAnimation(true);
        dispatch(toggleVisibility(true));
        // Aguarda 2 segundos antes de esconder o manual para a animação
        setTimeout(() => {
            setView(false);
        }
            , 2000);
    }

    return (
        <div className={cn("fixed top-0 left-0 inset-0 z-1000 w-full h-screen bg-black flex justify-center items-center duration-2000", !animation ? "opacity-100" : "opacity-0")}>
            <div className="sm:w-[80%] w-[90%] h-full flex flex-col gap-5 justify-center items-start">
                <p className="text-white sm:text-2xl text-xl font-bold italic font-raleway">
                    To turn on the arcade press and hold the left and right button at the same time
                </p>
                <p className="text-white sm:text-lg text-sm font-raleway opacity-80">
                    Joystick: WASD
                    <br />
                    Buttons: Arrow keys
                    <br />
                    <span className="sm:text-base text-xs italic font-raleway">&#40;Or you can press it manually&#41;</span>
                </p>
                <button onClick={handleClick} className="text-black sm:text-xl text-lg shadow-[5px_7px_2px_#423b3b] uppercase font-bold bg-white sm:px-3 px-2.5 sm:py-1.5 py-1 rounded-md cursor-pointer font-raleway hover:scale-90 duration-200">I get it</button>
            </div>
        </div>
    )
}