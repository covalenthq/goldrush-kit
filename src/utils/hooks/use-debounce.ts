import { useRef, type DependencyList, useEffect } from "react";

export const useDebounce = (
    func: (...args: unknown[]) => unknown,
    delay: number,
    deps: DependencyList
) => {
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            func();
        }, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [delay, ...deps]);

    return null;
};
