import './Button.css'

type ButtonProps = {
    title: string, 
    onClick: () => void,
    style?: any
}

export function Button(props: ButtonProps)
{
    return (
        <button
            onClick={props.onClick}
            className='button'
            style={props.style}
        >   
            <p className='button-title' >{props.title}</p>
        </button>
    )
}