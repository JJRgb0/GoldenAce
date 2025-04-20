import { useDispatch } from "react-redux";
import { setPath, toggleScreenVisibility } from "../../redux/slices/arcadeSlice";

export default function TurnOff() {

    // Redux
    const dispatch = useDispatch();

    // Function to play turn off audio
    const playAudio = () => {
        const ctx = new AudioContext()
        const volume = ctx.createGain();
        volume.gain.value = 0.1;
        const audio = new Audio('audios/turningOff.mp3');
        const source = ctx.createMediaElementSource(audio);
        source.connect(volume);
        volume.connect(ctx.destination);
        audio.play();
    }

    return <video autoPlay={true} onPlay={() => playAudio()} onEnded={() => (dispatch(setPath(undefined)), dispatch(toggleScreenVisibility(false)))} src="/videos/turnOffAnimation.mp4" className="h-full w-full" />
}