
import './ButtonMedium.css'

type TButtonMedium = {
    onClick: () => void,
    title: string,
    style?: any,
    styleTitle?: any
}

export function ButtonMedium(props: TButtonMedium) {
    return (
        <button
            className="buttonmedium"
            onClick={props.onClick}
            style={props.style}
        >
            <p className="buttonmedium-title" style={props.styleTitle}>{props.title}</p>
        </button>
    )
}