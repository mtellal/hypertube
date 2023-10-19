import React, { useState } from "react";

import './PickMenuSmall.css'

import arrowIcon from '../../../assets/Unfold_More.svg'

type TPickMenu = {
    title: string,
    options: string[], 
    value: string, 
    setValue: (s:string) => void, 
    style?: {}, 
    displayUp?: boolean
}


export default function PickMenuSmall(props: TPickMenu) {

    const [selecting, setSelecting] = useState(false);

    function select(option: string)
    {
        if (!option)
            option = "none"
        props.setValue(option);
        setSelecting((s:boolean) => !s);
    }

    function style()
    {
        let s = {};
        if (selecting)
            s = {visibility: "visible"};
        else
            s = {visibility: "hidden"};
        if (props.displayUp)
            s = {...s, bottom: '100%', top:'initial'}
        return (s)
    }

    return (
        <div className="pickmenusmall" style={props.style}>
            <p className="pickmenusmall-title">{props.title}</p>
            <div
                className="pickmenusmall-select"
                onClick={() => setSelecting((s: boolean) => !s)}
            >
                <p className="pickmenusmall-options-placeholder" >{props.value || "none"}</p>
                <img src={arrowIcon} style={{marginLeft: 'auto'}}/>
            </div>

            <div
                className="pickmenusmall-menu" 
                style={style()}>
                <p onClick={() => select("")}  className="pickmenusmall-options" style={{border: 'none'}} >none</p>
                {
                    props.options.map((o: string) =>
                        <p key={o} onClick={() => select(o)} className="pickmenusmall-options">{o}</p>
                    )
                }
            </div>

        </div>
    )
}