import axios from "axios";
import React, { useRef } from "react";
import { statuses, USER_IS_LOGGING_IN, USER_REGISTERED } from "../App";
import useFormState from "../hooks/useFormState";
import Button from "./UI/Button";
import Card from "./UI/Card";
import Form from "./UI/Form";
import { Input } from "./UI/Input";
import Label from "./UI/Label";
import Link from "./UI/Link";

export default function Register({ dispatch }) {
    const { formErrors, setFormErrors, errorCleanup } = useFormState({
        email: { hasError: false, error: "" },
        password: { hasError: false, error: "" },
    });

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
            dispatch({ type: statuses.LOADING });

            //send request
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/register",
                {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                }
            );

            //resolved
            dispatch({ type: statuses.RESOLVED });

            //set token in local storage
            localStorage.set("authToken", data.token);

            //pass along user id
            dispatch({
                type: USER_REGISTERED,
            });
        } catch (error) {
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

            dispatch({ type: statuses.FAILED });
        }
    }

    return (
        <Card>
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
                    />
                </div>

                <Link onClick={goToLogin}>Have an account?</Link>
                <Button type="submit">Register</Button>
            </Form>
        </Card>
    );
}
