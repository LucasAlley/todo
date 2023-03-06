import axios from "axios";
import React, { useRef } from "react";
import { USER_IS_LOGGING_IN, USER_REGISTERED } from "../App";
import useFormState from "../hooks/useFormState";
import useStatus from "../hooks/useStatus";
import Button from "./UI/Button";
import Form from "./UI/Form";
import { Input } from "./UI/Input";
import Label from "./UI/Label";
import Link from "./UI/Link";
import Spinner from "./UI/Spinner";

export default function Register({ dispatch }) {
    const { formErrors, setFormErrors, errorCleanup } = useFormState({
        email: { hasError: false, error: "" },
        password: { hasError: false, error: "" },
    });

    const [status, statusSetters] = useStatus("IDLE");

    //input refs
    const emailRef = useRef();
    const passwordRef = useRef();

    //"navigate" to login
    function goToLogin() {
        dispatch({ type: USER_IS_LOGGING_IN });
    }

    async function handleRegister(e) {
        try {
            e.preventDefault();

            //loading
            statusSetters.loading();

            //send request
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/register",
                {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                }
            );

            //resolved
            statusSetters.resolved();

            //set token in local storage
            localStorage.setItem("authToken", data.token);

            //pass along user id
            dispatch({
                type: USER_REGISTERED,
            });
        } catch (error) {
            //failed
            statusSetters.failed();

            if (error.response.data.errors) {
                const formattedErrors = {};
                for (const key in error.response.data.errors) {
                    formattedErrors[key] = {
                        hasError: true,
                        error: error.response.data.errors[key][0],
                    };
                }

                setFormErrors((currentState) => ({
                    ...currentState,
                    ...formattedErrors,
                }));
            }
        }
    }

    return (
        <Form onSubmit={handleRegister}>
            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    hasError={formErrors.email.hasError}
                    error={formErrors.email.error}
                    onFocus={errorCleanup}
                    disabled={status === "LOADING" || status === "RESOLVED"}
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    ref={passwordRef}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    hasError={formErrors.password.hasError}
                    error={formErrors.password.error}
                    onFocus={errorCleanup}
                    disabled={status === "LOADING" || status === "RESOLVED"}
                />
            </div>

            <Link onClick={goToLogin}>Have an account?</Link>
            <Button
                type="submit"
                disabled={status === "LOADING" || status === "RESOLVED"}
            >
                {status === "LOADING" ? <Spinner /> : "Register"}
            </Button>
        </Form>
    );
}
