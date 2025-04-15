import { clsx, ClassValue } from "clsx";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getExternalSound({ setContext, setSoundState, audioPath }: { setContext: Dispatch<SetStateAction<AudioContext | null>>; setSoundState: Dispatch<SetStateAction<AudioBuffer | null>>; audioPath: string }) {
    const ctx = new AudioContext();
    setContext(ctx);
    const loadSound = async () => {
        try {
            const response = await fetch(audioPath);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            setSoundState(audioBuffer);
        } catch (error) {
            console.error('Erro ao carregar o som:', error);
        }
    };
    loadSound();
    return () => {
        ctx.close();
    }
}