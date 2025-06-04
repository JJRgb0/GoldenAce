import { useEffect, useRef } from "react";

export default function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    }); // Atualiza após cada render para ter o valor da render anterior na próxima
    return ref.current;
}