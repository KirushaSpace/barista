import { useEffect, useState } from 'react';

export const useSessionStorage = (
    key: string,
    defaultValue: string,
): ReturnType<typeof useState<string>> => {
    const [value, setValue] = useState(
        () =>
            JSON.parse(JSON.stringify(sessionStorage.getItem(key))) ||
            defaultValue,
    );

    useEffect(() => {
        sessionStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
};
