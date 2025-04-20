import { useCallback, useRef, useState } from "react";

export default function useThrottle<T>(callback: () => T, delay: number = 300) {
    const [isThrottled, setIsThrottled] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const throttledCallback = useCallback(() => {
        if (!isThrottled) {
            callback();
            setIsThrottled(true);
            timeoutRef.current = setTimeout(() => {
                setIsThrottled(false);
            }, delay);
        }
    }, [callback, delay, isThrottled]);

    return throttledCallback;
}