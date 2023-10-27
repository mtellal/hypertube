import './RoundIconBorder.css'

export function RoundIconBorder(props: any)
{
    return (
        <button
            className="roundicon"
            onClick={props.onClick}
            style={props.style}
        >
            <img className="roundicon-img" src={props.icon} />
        </button>
    )
} 