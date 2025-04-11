import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { setPath } from "../../redux/slices/arcadeSlice";

export default function Entrace() {
    const dispatch = useDispatch();
    return (
        <video autoPlay={true} onEnded={() => dispatch(setPath('/'))} src="/videos/goldenAceEntrace.mp4" width={878} height={777} />
    )
}