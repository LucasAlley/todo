import { useState } from "react";

export default function useFormState(initialState) {
    //error state
    const [formErrors, setFormErrors] = useState(initialState);

    //super simple error cleanup
    function errorCleanup(e) {
        const { id } = e.target;

        if (formErrors[id].hasError) {
            //clear error
            setFormErrors((currentState) => ({
                ...currentState,
                [id]: { hasError: false, error: "" },
            }));
        }
    }

    return {
        formErrors,
        setFormErrors,
        errorCleanup,
    };
}
