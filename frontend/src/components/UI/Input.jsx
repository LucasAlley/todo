import clsx from "clsx";
import React, { forwardRef } from "react";

export const Input = forwardRef((props, ref) => (
    <div className="mt-2">
        <input
            className={clsx(
                "block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset",
                props.hasError
                    ? "text-red-900 ring-red-500 placeholder:text-red-300 focus:ring-red-500"
                    : "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
            )}
            {...props}
            ref={ref}
        />

        {props.hasError ? (
            <p className="mt-2 text-sm text-red-600">{props.error}</p>
        ) : null}
    </div>
));
