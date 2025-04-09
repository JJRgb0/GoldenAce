import { Dispatch, SetStateAction } from "react";

export default function Entrace({ setView }: { setView: Dispatch<SetStateAction<boolean>> }) {
    return (
        <video autoPlay={true} onEnded={() => setView(false)} src="/videos/goldenAceEntrace.mp4" width={878} height={777} />
    )
}