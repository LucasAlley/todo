import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import List from "./components/List";
import Login from "./components/Login";
import Register from "./components/Register";
import Card from "./components/UI/Card";
import ocean from "./images/ocean.png";

//initial state
const initialState = {
    isAuthenticated: false,
    userID: null,
    isLoggingIn: false,
    isRegistering: false,
    status: "IDLE",
};

//types
export const USER_AUTHENTICATED = "USER_AUTHENTICATED";
export const USER_IS_LOGGING_IN = "USER_IS_LOGGING_IN";
export const USER_IS_REGISTERING = "USER_IS_REGISTERING";
export const USER_IS_LOGGED_OUT = "USER_IS_LOGGED_OUT";
export const GOT_USER = "GOT_USER";
export const USER_REGISTERED = "USER_REGISTERED";
export const USER_LOGGED_IN = "USER_LOGGED_IN";

function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        //flip booleans
        case USER_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: true,
                isLoggingIn: false,
                isRegistering: false,
            };
        case USER_IS_LOGGING_IN:
            return {
                ...state,
                isLoggingIn: true,
                isRegistering: false,
            };
        case USER_IS_REGISTERING:
            return {
                ...state,
                isRegistering: true,
                isLoggingIn: false,
            };
        case USER_IS_LOGGED_OUT:
            return {
                ...state,
                isAuthenticated: false,
                isLoggingIn: true,
            };
        //user registered
        case USER_REGISTERED:
            return {
                ...state,
                isAuthenticated: true,
                isRegistering: false,
            };
        //user logged in
        case USER_LOGGED_IN:
            return {
                ...state,
                isAuthenticated: true,
                isLoggingIn: false,
            };
        //set userID
        case GOT_USER:
            return {
                ...state,
                isAuthenticated: true,
            };

        default:
            return initialState;
    }
}

function DynamicCard({ state = initialState, dispatch }) {
    /**
     * I'm opting for a variable here instead of useState due to this component being a child component
     * and the value is determined based on a state value being handled in the parent component. So
     * for every change that happens in the parent the child will re-render and the header variable will
     * be updated accordingly. Basically taking advantage of how react handles re-renders.
     */
    const toRender = state.isAuthenticated ? (
        <List dispatch={dispatch} />
    ) : state.isLoggingIn ? (
        <Login dispatch={dispatch} />
    ) : (
        <Register dispatch={dispatch} />
    );

    return (
        <motion.div
            initial={{ width: "20%" }}
            animate={{
                width: state.isAuthenticated ? "60%" : "20%",
            }}
            transition={{ duration: 0.6 }}
            exit={{ width: "20%" }}
        >
            <Card>{toRender}</Card>
        </motion.div>
    );
}

function DynamicHeader({ state = initialState }) {
    /**
     * I'm opting for a variable here instead of useState due to this component being a child component
     * and the value is determined based on a state value being handled in the parent component. So
     * for every change that happens in the parent the child will re-render and the header variable will
     * be updated accordingly. Basically taking advantage of how react handles re-renders.
     */
    const header = state.isLoggingIn
        ? "Login"
        : state.isRegistering
        ? "Registration"
        : "";

    return (
        <div className="absolute top-20 z-10 flex items-center space-x-4">
            <h1 className="text-white font-semibold text-6xl tracking-wider">
                TODO
            </h1>
            <h1 className="text-white font-light text-4xl tracking-wider">
                {header}
            </h1>
        </div>
    );
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function fetchUser() {
            try {
                //send request - if successful the user is authenticated
                await axios.get("http://127.0.0.1:8000/api/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                });

                //display login card
                dispatch({ type: USER_AUTHENTICATED });
            } catch (error) {
                //user is not authenticated
                dispatch({ type: USER_IS_LOGGING_IN });
            }
        }

        fetchUser();
    }, []);

    return (
        <>
            {/* <button
                className="bg-red-900 h-32 w-12 relative z-20"
                type="button"
                onClick={() => {
                    if (state.isLoggingIn) {
                        dispatch({ type: USER_IS_REGISTERING });
                    } else {
                        dispatch({ type: USER_IS_LOGGING_IN });
                    }
                }}
            >
                click mesdfsdfsdfsdfsdf
            </button> */}
            <div className="bg-gray-100 h-screen flex flex-col justify-center items-center ">
                <DynamicHeader state={state} />
                <DynamicCard state={state} dispatch={dispatch} />
                <img
                    className="w-full h-1/2 absolute top-0"
                    src={ocean}
                    alt="ocean"
                />
            </div>
        </>
    );
}

export default App;
