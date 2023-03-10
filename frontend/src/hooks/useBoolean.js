import { useMemo, useState } from "react";

export default function useBoolean(defaultValue) {
    const [value, setValue] = useState(defaultValue);

    const setters = useMemo(
        () => ({
            on() {
                setValue(true);
            },
            off() {
                setValue(false);
            },
            toggle() {
                setValue((value) => !value);
            },
        }),
        [setValue]
    );

    return [value, setters];
}
