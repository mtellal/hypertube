import './ButtonLarge.css'


type ButtonLargeProps = {
    title: string,
    style: any,
    onClick: () => void
}

export function ButtonLarge(props: ButtonLargeProps) {
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