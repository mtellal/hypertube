import React from "react";

import './ButtonWrapper.css'

export function ButtonWrapper({children, ...props} : any)
{
    return (
        <button
            className="buttonwrapper"
            onClick={props.onClick}
            {...props}
        >
            {children}
        </button>
    )
}