import { useEffect } from 'react';

export const useDebouncedEffect = (onDebouncedEvent, value, timeoutVal) => {
    useEffect(() => {
        const handler = setTimeout(onDebouncedEvent, timeoutVal);

        return () => {
            clearTimeout(handler);
        };
    }, [value, timeoutVal]);
}

export default useDebouncedEffect;
