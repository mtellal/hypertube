import React from "react";


import './SearchBar.css'
import { Icon } from "../../Icons/Icon";
import searchIconBlack from '../../../assets/Search Black.svg'


type TInput = {
    value: string,
    setValue: (s: string) => void,
    placeholder?: string,
    maxLength?: number,
    onSubmit?: () => void,
    style?: {},
    onClick?: () => void,
    onChange?: (((s: any) => void) | (() => void))
}


export default function SearchBar(props: TInput) {

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange)
            props.onChange(e.target.value)
    }

    return (
        <label id="searchbarinput" className="searchbar" style={props.style}>
            <img
                src={searchIconBlack}
                style={{height: '60%'}}
            />
            <input
                id="searchbarinput"
                className="searchbar-input"
                style={props.style}
                placeholder={props.placeholder || ""}
                value={props.value}
                onChange={onChange}
                onSubmit={props.onSubmit}
                maxLength={props.maxLength}
                onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
            />

        </label>
    )
}