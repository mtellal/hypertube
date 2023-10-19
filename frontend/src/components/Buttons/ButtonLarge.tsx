import React from 'react';

import './ButtonLarge.css'

export function ButtonLarge(props: any)
{
    return (
        <button
            onClick={props.onClick}
            className='buttonlarge'
            style={props.style}
        >   
            <p className='buttonlarge-title' >{props.title}</p>
        </button>
    )
}