import React, { useCallback, useEffect, useRef, useState } from "react";

import './ProfileUser.css'

import PhotoCarousel from "../../../components/PhotoCarousel/PhotoCarousel";
import { useNavigate, useParams } from "react-router";
import { useCurrentUser } from "../../../contexts/UserContext";
import { InfoLabel } from "../ProfilePage/InfoLabel/InfoLabel";
import { getUserPhotoRequest, getUserRequest } from "../../../requests";
import { useLanguage } from "../../../contexts/language";


export default function ProfileUser(props: any) {

    const navigate = useNavigate();
    const { language } = useLanguage();

    const { currentUser } = useCurrentUser();
    const [user, setUser]: any = useState();
    const [photos, setPhotos] = useState([]);
    const { id } = useParams();
    const userLoadingRef = useRef(false);

    async function loadPhotos(u: any) {
        getUserPhotoRequest(parseInt(id))
            .then(res => {
                if (res && res.data) {
                    setPhotos((p: any) => [window.URL.createObjectURL(new Blob([res.data]))])
                }
            })
            .catch(() => { })
    }

    const loadUser = async () => {
        let u: any = null;
        userLoadingRef.current = true;
        await getUserRequest(id)
            .then((res: any) => {
                if (res.data && res.data.user) {
                    setUser({ ...res.data.user, id })
                    u = res.data.user;
                }
            })
            .catch((err: any) => {
                navigate("/profile")
            })
        if (u)
            loadPhotos(u);
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
                    <PhotoCarousel photo={photos} user={user} />
                    <>
                        <InfoLabel title={language && language.profile.FirstName} text={user && user.firstName || "Not specified"} />
                        <InfoLabel title={language && language.profile.LastName} text={user && user.lastName || "Not specified"} />
                        <InfoLabel title={language && language.profile.Username} text={user && user.username || "Not specified"} />
                    </>
                </div>

            </div>
        </div>
    )
}