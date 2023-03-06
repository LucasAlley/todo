import clsx from "clsx";
import React from "react";

export default function Card({ children, width = "w-3/12", margin }) {
    return (
        <div
            className={clsx(
                "bg-white rounded border border-gray-300 p-8 shadow-lg z-20 max-h-full relative",
                width,
                margin
            )}
        >
            {children}
        </div>
    );
}
