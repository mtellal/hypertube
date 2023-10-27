import { useCallback, useEffect, useState } from "react";

import './ProfileCurrentUser.css'

import PhotoCarousel from "../../../components/PhotoCarousel/PhotoCarousel";
import PickPhotos, { TPhoto } from "../../../components/PickPhotos/PickPhotos";

import ProfileUserPref from "../ProfilePage/ProfileUserPref/ProfileUserPref";

import { updatePhotosRequest } from "../../../requests";
import { useCurrentUser } from "../../../contexts/UserContext";
import { User } from "../../../types";

export default function ProfileCurrentUser() {

    const { currentUser, setCurrentUser } = useCurrentUser();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")

    const [photo, setPhoto] = useState<TPhoto | string>()
    const [editPhotos, setEditPhotos] = useState(false);
    const [profileUser, setProfileUser] = useState<User>();

    useEffect(() => {
        if (currentUser) {
            setProfileUser(currentUser)
            if (currentUser.photo)
                setPhoto(currentUser.photo)
        }
    }, [currentUser])

    const updatePhotos = useCallback(async () => {
        setError("");
        setSuccess("");
        setEditPhotos((p: boolean) => !p);
        if (photo && (photo as TPhoto).url && (photo as TPhoto).file) {
            if ((photo as TPhoto).file.type !== "image/jpeg")
                return (setError("Invalid type of image (valid extension .jpeg)"));
            if ((photo as TPhoto).file.size >= 1024 * 1024 * 10)
                return (setError("File too long (max size 10MB"))
            setCurrentUser((u: User) => ({ ...u, photo: (photo as TPhoto).url }))
            try {
                const res = await updatePhotosRequest((photo as TPhoto).file)
                if (res && res.data && res.data.message)
                    setSuccess(res.data.message)
                else
                    setError("Update user photo succeed")
            }
            catch (err) {
                if (err && err.response && err.response.data && err.response.data.message)
                    setError(err.response.data.message)
                else
                    setError("Update user photo failed")
            }
        }
    }, [profileUser, photo]);

    return (
        <div className="profilepage-c">
            <div className="profilecurrentuser">
                <div style={{ height: '100%', flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <div className="profilecurrentuser-carousel">
                        <div style={{ paddingBottom: '10px' }}>
                            {error && <p className="font-14 error-msg">{error}</p>}
                            {success && <p className="font-14 success-msg">{success}</p>}
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
                                    onClickIcon={() => setEditPhotos((p: boolean) => !p)}
                                    photo={photo as string}
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
