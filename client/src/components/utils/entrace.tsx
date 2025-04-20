import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPath } from "../../redux/slices/arcadeSlice";

export default function Entrace() {

    // Redux
    const dispatch = useDispatch();
    const arcadeVolume = useSelector((state: any) => state.arcade[2].volume);
    const buttonsControls = useSelector((state: any) => state.controls[1]);

    // Refs
    const video = useRef<HTMLVideoElement>(null);

    // Set entrance volume
    useEffect(() => {
        if (video.current) {
            video.current.volume = arcadeVolume / 100;
        }
    }, [])

    // Handle video speed
    useEffect(() => {
        if (buttonsControls[1]) {
            if (video.current) {
                video.current.playbackRate = 2;
            }
        } else {
            if (video.current) {
                video.current.playbackRate = 1;
            }
        }
    }, [buttonsControls[1]])

    return (
        <video autoPlay={true} ref={video} onEnded={() => dispatch(setPath('/'))} src="/videos/goldenAceEntrace.mp4" width={878} height={777} />
    )
}