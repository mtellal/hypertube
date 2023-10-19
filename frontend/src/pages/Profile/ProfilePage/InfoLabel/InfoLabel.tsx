
import './InfoLabel.css'

export function InfoLabel(props: any) {
    return (
        <div className="infolabel">
            <h3 className="title-input" style={{ marginBottom: '5px' }}>{props.title}</h3>
            <p className="font-14">{props.text}</p>
        </div>
    )
}

