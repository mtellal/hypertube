import React from 'react';

import './Button.css'

export function Button(props: any)
{
    return (
        <button
            onClick={props.onClick}
            className='button'
            style={props.style}
        >   
            <p className='button-title' >{props.title}</p>
        </button>
    )
}