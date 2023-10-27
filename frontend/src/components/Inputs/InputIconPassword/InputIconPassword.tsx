import { useState } from 'react';
import { Icon } from '../../Icons/Icon';
import './InputIconPassword.css'

import eyeIcon from '../../../assets/eye.svg'

type InputIconPasswordProps = {
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength: number,
    style?: {}
    onChange?: () => void,
    onSubmit?: () => void,

}

export function InputIconPassword(props: InputIconPasswordProps) {

    const [type, setType] = useState("password");

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange)
        {
            setType("password");
            props.onChange();
        }
    }

    return (
        <div className="inputicon" style={props.style}>
            <input
                className='inputicon-input'
                style={props.style}
                placeholder={props.placeholder}
                value={props.value}
                onChange={onChange}
                onSubmit={props.onSubmit}
                maxLength={props.maxLength}
                onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                type={type}
            />
            <Icon
                style={{ height: '48%', padding: '1%', }}
                icon={eyeIcon}
                onClick={() => setType((s: string) => s === "password" ? "text" : "password")}
            />
        </div>
    )
}