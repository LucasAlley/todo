import axios from "axios";
import clsx from "clsx";
import React, {
    Children,
    cloneElement,
    useEffect,
    useRef,
    useState,
} from "react";
import { USER_IS_LOGGED_OUT } from "../App";
import useBoolean from "../hooks/useBoolean";
import { SecondaryButton } from "./UI/Button";
import Card from "./UI/Card";
import Modal from "./UI/Modal";
import Toggle from "./UI/Toggle";

//todo
function Todo({ todo, toggleComplete, updateDescription, deleteTodo }) {
    const [enabled, setEnabled] = useState(todo.complete === 1);

    return (
        <div className="p-4 flex items-center space-x-2">
            <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-100 hover:bg-red-300 rounded-full p-2 transition-all duration-150"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-red-500 "
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                </svg>
            </button>
            <Toggle
                onChange={(e) => {
                    setEnabled((currentState) => !currentState);
                    toggleComplete(todo.id);
                }}
                enabled={enabled}
            />
            <input
                className="w-full text-gray-700 font-bold tracking-wide p-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600"
                defaultValue={todo.description}
                onBlur={(e) => updateDescription(todo.id, e.target.value)}
            />
        </div>
    );
}
//todo mapper
function TodoMapper({ todos, toggleComplete, updateDescription, deleteTodo }) {
    return (
        <>
            <div className="divide-y divide-slate-300">
                {todos.map((todo, idx) => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        toggleComplete={toggleComplete}
                        updateDescription={updateDescription}
                        deleteTodo={deleteTodo}
                    />
                ))}
            </div>
        </>
    );
}
//counter
function TodoCounter({ todos }) {
    const length = todos.length;
    return (
        <p className="text-gray-500 font-light text-sm italic">
            {length} todo{length > 1 ? "s" : ""}
        </p>
    );
}
//single filter
function Filter({ active = false, setActiveFilter, filterID, children }) {
    return (
        <button
            type="button"
            onClick={() => setActiveFilter(filterID)}
            className={clsx(
                "transition-all duration-150 tracking-wider",
                active
                    ? "text-emerald-500 font-medium"
                    : "text-gray-500 font-light"
            )}
        >
            {children}
        </button>
    );
}
//container
function FiltersContainer({ children, activeFilter, setActiveFilter }) {
    //pass down state and state setter to every child
    return (
        <div className="flex space-x-6 items-center">
            {Children.map(children, (child, idx) =>
                cloneElement(child, {
                    active: activeFilter === idx,
                    setActiveFilter: setActiveFilter,
                    filterID: idx,
                })
            )}
        </div>
    );
}

export default function List({ dispatch }) {
    const [todos, setTodos] = useState([]);
    const [activeFilter, setActiveFilter] = useState(0);

    const [open, { toggle }] = useBoolean(false);

    const newTodoRef = useRef();

    useEffect(() => {
        async function fetchTodos() {
            try {
                //send request - if successful the user is authenticated
                const { data } = await axios.get(
                    //
                    `http://127.0.0.1:8000/api/todos${
                        activeFilter > 0 ? `?complete=${activeFilter - 1}` : ""
                    }`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "authToken"
                            )}`,
                        },
                    }
                );

                setTodos(data.todos);
            } catch (error) {
                console.log(error);
            }
        }

        fetchTodos();
    }, [activeFilter]);

    //toggle a todos complete status
    async function toggleComplete(todoID) {
        try {
            //send request
            await axios.get(
                `http://127.0.0.1:8000/api/todos/toggle/${todoID}`,

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            //set state
            setTodos((currentState) => {
                //format the state so that the todos complete value is set properly
                const formattedState = currentState.map((c) => {
                    if (c.id === todoID) {
                        return {
                            ...c,
                            //flip the boolean
                            complete: c.complete === 1 ? 0 : 1,
                        };
                    }

                    return c;
                });

                if (activeFilter !== 0) {
                    //filter the formatted state
                    return formattedState.filter((t) => t.id !== todoID);
                }

                //no filter - return all todos
                return formattedState;
            });
        } catch (error) {
            console.log(error.response);
        }
    }

    //update todo description
    async function updateDescription(todoID, newDescription) {
        try {
            //send request
            await axios.post(
                `http://127.0.0.1:8000/api/todos/update/${todoID}`,
                { description: newDescription },

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            //set state
            setTodos((currentState) => {
                //format the state so that the todos complete value is set properly
                const formattedState = currentState.map((c) => {
                    if (c.id === todoID) {
                        return {
                            ...c,
                            //flip the boolean
                            complete: c.complete === 1 ? 0 : 1,
                        };
                    }

                    return c;
                });

                if (activeFilter !== 0) {
                    //filter the formatted state
                    return formattedState.filter((t) => t.id !== todoID);
                }

                //no filter - return all todos
                return formattedState;
            });
        } catch (error) {
            console.log(error.response);
        }
    }

    //save new todo
    async function saveTodo() {
        try {
            if (newTodoRef.current.value === "") {
                //ignore
                return;
            }

            //send request
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/todos",
                {
                    description: newTodoRef.current.value,
                    complete: activeFilter === 2,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            //set state
            setTodos((currentState) => [
                {
                    ...data.todo,
                },
                ...currentState,
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    //clear all completed todos
    async function clearCompleted() {
        try {
            //send request
            await axios.delete(
                "http://127.0.0.1:8000/api/todos/complete",

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            //set state
            setTodos((currentState) =>
                currentState.filter((c) => c.complete !== 1)
            );

            //toggle modal
            toggle();
        } catch (error) {
            console.log(error);
        }
    }

    //clear single todo
    async function deleteTodo(todoID) {
        try {
            //send request
            await axios.delete(
                `http://127.0.0.1:8000/api/todos/${todoID}`,

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            //set state
            setTodos((currentState) =>
                currentState.filter((c) => c.id !== todoID)
            );

            //toggle modal TODO:
            // toggle();
        } catch (error) {
            console.log(error);
        }
    }

    //log out
    async function logout() {
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            //remove token from local storage
            localStorage.removeItem("authToken");

            dispatch({ type: USER_IS_LOGGED_OUT });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="xl:w-5/12 w-11/12 mb-4 bg-white z-10 rounded shadow p-4 flex items-center space-x-3">
                <input
                    className="w-full text-gray-700 font-bold tracking-wide p-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600"
                    placeholder="new todo.."
                    ref={newTodoRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value !== "") {
                            saveTodo();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={saveTodo}
                    className="hover:bg-emerald-100 p-2 rounded-full transition-all duration-150"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-emerald-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                        />
                    </svg>
                </button>
            </div>

            <Card width="xl:w-5/12 w-11/12">
                <div className="flex flex-col justify-between max-h-80 overflow-hidden overflow-y-scroll">
                    <TodoMapper
                        todos={todos}
                        toggleComplete={toggleComplete}
                        updateDescription={updateDescription}
                        deleteTodo={deleteTodo}
                    />
                </div>
                <div className="flex sm:flex-row flex-col justify-between items-center mt-2  border-t border-t-slate-300 pt-6">
                    <TodoCounter todos={todos} />
                    <FiltersContainer
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    >
                        <Filter>All</Filter>
                        <Filter>In-Progress</Filter>
                        <Filter>Completed</Filter>
                    </FiltersContainer>
                    <button
                        className="text-gray-500 font-light tracking-wide text-sm"
                        type="button"
                        onClick={toggle}
                    >
                        Clear completed
                    </button>
                </div>

                <div className="w-2/12 ml-auto mt-4">
                    <SecondaryButton type="button" onClick={logout}>
                        Logout
                    </SecondaryButton>
                </div>
            </Card>

            <Modal open={open} toggle={toggle} handleClear={clearCompleted} />
        </>
    );
}
