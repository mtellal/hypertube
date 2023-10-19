
import './ButtonIcon.css'

type TButtonAIcon = {
    onClick?: () => void,
    icon: string,
    style?: any,
    styleTitle?: any
}

export function ButtonIcon(props: TButtonAIcon) {
    return (
        <button
            className="buttonmedium"
            onClick={props.onClick}
            style={props.style}
        >
            <img className='buttonicon-img' src={props.icon} />
        </button>
    )
}