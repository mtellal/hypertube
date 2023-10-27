import './ButtonBorder.css'

type ButtonBorderProps = {
    title: string,
    onClick: () => void,
    style?: {},
    notif?: boolean
}

export function ButtonBorder(props: ButtonBorderProps) {
    return (
        <button className="buttonborder" onClick={props.onClick} style={props.style} >
            <p className="buttonborder-title" >{props.title}</p>
        </button>
    )
}

export function ButtonBorderMenu(props: ButtonBorderProps) {
    return (
        <div style={{ position: 'relative' }}>
            <button className="buttonbordermenu" onClick={props.onClick} style={props.style} >
                <p className="buttonborder-title" >{props.title}</p>
            </button>
            {props.notif && <div className="btnborder-menu"></div>}
        </div>
    )
}