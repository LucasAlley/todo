import React from "react";

export default function Form(props) {
    return (
        <form className="space-y-6" {...props}>
            {props.children}
        </form>
    );
}
