
import './PhotoCarousel.css'

import EditBlack from '../../assets/Edit_Pencil Black.svg'
import { RoundIconBorder } from "../Icons/RoundIconBorder";
import { useParams } from 'react-router';
import { useCurrentUser } from '../../contexts/UserContext';


type TPhotoCarousel = {
    user: any,
    photo: any,
    onClickIcon?: () => void,
    isCurrentUser?: boolean
}


export default function PhotoCarousel(props: TPhotoCarousel) {

    const { id } = useParams();
    const { currentUser } = useCurrentUser();

    return (
        <div className="photocarousel" >
            <div className="photocarousel-c1-c">
                <div className="photocarousel-c1">
                    <img
                        src={props.photo}
                        className="photocarousel-i2"
                    />
                    {
                        currentUser && (currentUser.userId === id || !id) &&
                        <div className="photocarousel-edit" onClick={() => { }} >

                            <RoundIconBorder
                                icon={EditBlack}
                                onClick={props.onClickIcon}
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
