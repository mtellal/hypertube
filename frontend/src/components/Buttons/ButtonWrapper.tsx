import React, { ReactNode } from "react";

import './ButtonWrapper.css'

type ButtonWrapperProps = {
    children: ReactNode, 
    onClick: () => {}
}

export function ButtonWrapper({children, onClick} : ButtonWrapperProps)
{
    return (
        <button className="buttonwrapper" onClick={onClick} >
            {children}
        </button>
    )
}