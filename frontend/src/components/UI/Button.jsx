import React from "react";

export default function Button(props) {
    return (
        <button
            className="flex w-full justify-center rounded-md  bg-emerald-400 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-100"
            {...props}
        >
            {props.children}
        </button>
    );
}

export function SecondaryButton(props) {
    return (
        <button
            className="flex w-full justify-center rounded-md  bg-emerald-50 py-2 px-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-100"
            {...props}
        >
            {props.children}
        </button>
    );
}
