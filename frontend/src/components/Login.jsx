import axios from "axios";
import React, { useRef } from "react";
import { USER_IS_REGISTERING, USER_LOGGED_IN } from "../App";
import useFormState from "../hooks/useFormState";
import useStatus from "../hooks/useStatus";
import Button from "./UI/Button";
import Form from "./UI/Form";
import { Input } from "./UI/Input";
import Label from "./UI/Label";
import Link from "./UI/Link";
import Spinner from "./UI/Spinner";

export default function Login({ dispatch }) {
    const { formErrors, setFormErrors, errorCleanup } = useFormState({
        email: { hasError: false, error: "" },
        password: { hasError: false, error: "" },
    });
    const [status, statusSetters] = useStatus("IDLE");

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
            //loading
            statusSetters.loading();

            //send request
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/login",
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
                type: USER_LOGGED_IN,
                payload: {
                    userID: data.userID,
                },
            });
        } catch (error) {
            //failed
            statusSetters.failed();

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
                    onChange={errorCleanup}
                    hasError={formErrors.password.hasError}
                    error={formErrors.password.error}
                    disabled={status === "LOADING" || status === "RESOLVED"}
                />
            </div>
            <Link type="button" onClick={goToRegister}>
                Don't have an account?
            </Link>
            <Button
                type="submit"
                disabled={status === "LOADING" || status === "RESOLVED"}
            >
                {status === "LOADING" ? <Spinner /> : "Login"}
            </Button>
        </Form>
    );
}
