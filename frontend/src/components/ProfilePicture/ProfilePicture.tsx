import './ProfilePicture.css'

type TProfilePicture = {
    userId: number, 
    url: string, 
    onClick?: () => void,
    style?: {}
}

export function ProfilePicture(props: TProfilePicture) {
    return (
        <img 
            src={props.url} 
            className="profilepicture-img" 
            onClick={props.onClick}
            style={props.style}
        />
    )
}