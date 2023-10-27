import { ChangeEvent } from "react";

import './InputBiography.css'

type InputBiographyProps = {
    title: string,
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength: number,
    ronly?: boolean,
    style?: {},
    styleTextArea?: {},
}

export default function InputBiography(props: InputBiographyProps) {

    function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
        props.setValue(e.target.value);
    }

    return (
        <div className="pickmenu" style={{ position: 'relative', ...props.style }}>
            <p className="title-input">{props.title}</p>
            <textarea
                id="inputbio"
                className="inputbio-input"
                style={props.styleTextArea}
                placeholder={props.placeholder}
                value={props.value}
                onChange={onChange}
                maxLength={props.maxLength}
                rows={15}
                disabled={props.ronly}
            />
            <div style={{ position: 'absolute', top: '0' }}>
                <p className="font-12">{props.value.length} / {props.maxLength}</p>
            </div>
        </div>
    )
}

