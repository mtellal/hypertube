
import './ButtonMedium.css'

type ButtonMediumProps = {
    onClick: () => void,
    title: string,
    style?: any,
    styleTitle?: any
}

export function ButtonMedium(props: ButtonMediumProps) {
    return (
        <button className="buttonmedium" onClick={props.onClick} style={props.style} >
            <p className="buttonmedium-title" style={props.styleTitle}>{props.title}</p>
        </button>
    )
}