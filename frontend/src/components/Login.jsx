import axios from "axios";
import React, { useRef } from "react";
import { statuses, USER_IS_REGISTERING, USER_LOGGED_IN } from "../App";
import useFormState from "../hooks/useFormState";
import Button from "./UI/Button";
import Card from "./UI/Card";
import Form from "./UI/Form";
import { Input } from "./UI/Input";
import Label from "./UI/Label";
import Link from "./UI/Link";

export default function Login({ dispatch }) {
    const { formErrors, setFormErrors, errorCleanup } = useFormState({
        email: { hasError: false, error: "" },
        password: { hasError: false, error: "" },
    });

    //input refs
    const emailRef = useRef();
    const passwordRef = useRef();

    //"navigate" to register
    function goToRegister() {
        dispatch({ type: USER_IS_REGISTERING });
    }

    async function handleLogin(e) {
        e.preventDefault();

        try {
            //send request
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                }
            );

            //resolved
            dispatch({ type: statuses.RESOLVED });

            //set token in local storage
            localStorage.setItem("authToken", data.token);

            //pass along user id
            dispatch({
                type: USER_LOGGED_IN,
                payload: {
                    userID: data.userID,
                },
            });
        } catch (error) {
            //set generic errors
            setFormErrors({
                email: {
                    hasError: true,
                    error: "Check your email address and try again.",
                },
                password: {
                    hasError: true,
                    error: "Check your password and try again.",
                },
            });
        }
    }

    return (
        <Card>
            <Form onSubmit={handleLogin}>
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
                        onChange={errorCleanup}
                        hasError={formErrors.password.hasError}
                        error={formErrors.password.error}
                    />
                </div>
                <Link type="button" onClick={goToRegister}>
                    Don't have an account?
                </Link>
                <Button type="submit">Login</Button>
            </Form>
        </Card>
    );
}
