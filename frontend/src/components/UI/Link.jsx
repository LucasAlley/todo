import React from "react";

export default function Link(props) {
    return (
        <button
            type="button"
            className="text-indigo-500 mt-8 block ml-auto text-sm"
            {...props}
        >
            {props.children}
        </button>
    );
}
