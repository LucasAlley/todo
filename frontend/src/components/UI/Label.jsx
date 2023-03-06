import React from "react";

export default function Label(props) {
    return (
        <label
            className="block text-sm font-medium leading-6 text-gray-900"
            {...props}
        >
            {props.children}
        </label>
    );
}
