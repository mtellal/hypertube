import { useEffect, useRef, useState } from "react";

import './ProfileUser.css'

import PhotoCarousel from "../../../components/PhotoCarousel/PhotoCarousel";
import { useNavigate, useParams } from "react-router";
import { useCurrentUser } from "../../../contexts/UserContext";
import { InfoLabel } from "../ProfilePage/InfoLabel/InfoLabel";
import { getUserPhotoRequest, getUserRequest } from "../../../requests";
import { useLanguage } from "../../../contexts/language";
import { User } from "../../../types";

export default function ProfileUser() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { currentUser } = useCurrentUser();

    const [user, setUser]: any = useState();
    const [photo, setPhoto] = useState("");

    const userLoadingRef = useRef(false);

    async function loadPhotos() {
        getUserPhotoRequest(parseInt(id))
            .then(res => {
                if (res && res.data) {
                    setPhoto(window.URL.createObjectURL(new Blob([res.data])))
                }
            })
            .catch(() => { })
    }

    const loadUser = async () => {
        let u: User | undefined = null;
        userLoadingRef.current = true;
        try {
            const res = await getUserRequest(id)
            if (res.data && res.data.user) {
                setUser({ ...res.data.user, id })
                u = res.data.user;
            }
        }
        catch (e) {
            // console.log(e)
            navigate("/profile")
        }
        if (u)
            loadPhotos();
    };

    useEffect(() => {
        if (id) {
            if (currentUser && parseInt(id) === currentUser.userId)
                navigate("/profile")
            if (!userLoadingRef.current)
                loadUser();
        }
    }, [id, currentUser, userLoadingRef.current])

    return (
        <div style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
            <div className="profileuser">
                <div className="profileuser-carousel">
                    <PhotoCarousel photo={photo} />
                    <>
                        <InfoLabel
                            title={language && language.profile.FirstName}
                            text={user && user.firstName || "Not specified"}
                        />
                        <InfoLabel
                            title={language && language.profile.LastName}
                            text={user && user.lastName || "Not specified"}
                        />
                        <InfoLabel
                            title={language && language.profile.Username}
                            text={user && user.username || "Not specified"}
                        />
                    </>
                </div>

            </div>
        </div>
    )
}