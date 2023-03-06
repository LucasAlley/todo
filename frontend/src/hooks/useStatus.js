import { useMemo, useState } from "react";

export default function useStatus(defaultValue) {
    const [value, setValue] = useState(defaultValue);

    const setters = useMemo(
        () => ({
            idle() {
                setValue("IDLE");
            },
            loading() {
                setValue("LOADING");
            },
            resolved() {
                setValue("RESOLVED");
            },
            failed() {
                setValue("FAILED");
            },
        }),
        [setValue]
    );

    return [value, setters];
}
