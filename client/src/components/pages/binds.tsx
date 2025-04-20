import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux";
import { setPath } from "../../redux/slices/arcadeSlice";

export default function Binds() {

    //Redux
    const dispatch = useDispatch();
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])

    // Navigation in the component
    useEffect(() => {
        if (buttonsControls[2]) {
            dispatch(setPath('/options'))
        }

    }, [buttonsControls[2]]);

    return (
        <div className="w-full h-full text-white text-8xl">
            Rebind
        </div>
    )
}