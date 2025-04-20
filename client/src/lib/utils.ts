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
            console.error('Error loading the sound:', error);
        }
    };
    loadSound();
    return () => {
        ctx.close();
    }
}

export function playSound({ volume, audioContext, sound }: { volume: number; audioContext: AudioContext | null; sound: AudioBuffer | null }) {
    if (audioContext && sound) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume / 500;
        gainNode.connect(audioContext.destination);
        source.buffer = sound;
        source.connect(gainNode);
        source.start(0);
    }
}