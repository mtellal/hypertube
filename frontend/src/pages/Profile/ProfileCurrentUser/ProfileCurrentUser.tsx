import React, { useCallback, useContext, useEffect, useState } from "react";

import './ProfileCurrentUser.css'


import PhotoCarousel from "../../../components/PhotoCarousel/PhotoCarousel";
import PickPhotos from "../../../components/PickPhotos/PickPhotos";


import ProfileUserPref from "../ProfilePage/ProfileUserPref/ProfileUserPref";

import { updatePhotosRequest, updateUserRequest } from "../../../requests";
import { useCurrentUser } from "../../../contexts/UserContext";

export default function ProfileCurrentUser() {

    const { currentUser, setCurrentUser } = useCurrentUser();

    const [profileUser, setProfileUser]: any = useState();
    const [editPhotos, setEditPhotos] = useState(false);
    const [photo, setPhoto]: any = useState();

    const [success, setSuccess] = useState("")
    const [error, setError] = useState("");

    useEffect(() => {
        if (currentUser) {
            setProfileUser(currentUser)
            if (currentUser.photos)
                setPhoto(currentUser.photos)
        }
    }, [currentUser])

    const updatePhotos = useCallback(async () => {
        setError("");
        setSuccess("");
        setEditPhotos((p: boolean) => !p);
        if (photo && photo.url && photo.file) {
            if (photo.file.type !== "image/jpeg") {
                return (setError("Invalid type of image (valid extension .jpeg)"));
            }
            if (photo.file.size >= 1024 * 1024 * 10) {
                return (setError("File too long (max size 10MB"))
            }
            setCurrentUser((u: any) => ({ ...u, photos: photo.url }))
            updatePhotosRequest(photo.file)
                .then(res => {
                    if (res && res.data && res.data.message)
                        setSuccess(res.data.message)
                    else
                        setError("Update user photo succeed")
                })
                .catch(err => {
                    if (err && err.response && err.response.data && err.response.data.message)
                        setError(err.response.data.message)
                    else
                        setError("Update user photo failed")
                })
        }
    }, [profileUser, photo]);

    return (
        <div className="profilepage-c">
            <div className="profilecurrentuser">
                <div style={{
                    height: '100%',
                    flex: 2, justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="profilecurrentuser-carousel">
                        <div style={{ paddingBottom: '10px' }}>
                            {error && <p className="font-14" style={{ color: 'var(--red)' }}>{error}</p>}
                            {success && <p className="font-14" style={{ color: 'var(--green)' }}>{success}</p>}
                        </div>
                        {
                            editPhotos ?
                                <PickPhotos
                                    title="Edit your photos"
                                    photo={photo}
                                    setPhoto={setPhoto}
                                    style={{ width: '90%' }}
                                    editing={true}
                                    editClick={updatePhotos}
                                /> :
                                <PhotoCarousel
                                    user={profileUser}
                                    isCurrentUser={true}
                                    onClickIcon={() => setEditPhotos((p: boolean) => !p)}
                                    photo={photo}
                                />
                        }
                    </div>
                </div>

                <div className="profilecurrentuser-infos">
                    <ProfileUserPref />
                </div>
            </div>
        </div>
    )
}
