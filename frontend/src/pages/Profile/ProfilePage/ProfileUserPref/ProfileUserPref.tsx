import { useCallback, useEffect, useState } from "react";

import './ProfileUserPref.css'

import pencilIconBlack from '../../../../assets/Edit_Pencil Black.svg'
import checkIconBlack from '../../../../assets/Check Black.svg'
import { useLanguage } from "../../../../contexts/language";
import InputSmall from "../../../../components/Inputs/InputSmall/InputSmall";
import { useCurrentUser } from "../../../../contexts/UserContext";
import { validateEmail, validateNames } from "../../../../utils";
import { updateUserRequest } from "../../../../requests";
import { InfoLabel } from "../InfoLabel/InfoLabel";
import { RoundIconBorder } from "../../../../components/Icons/RoundIconBorder";
import { User } from "../../../../types";



function ProfileUserPrefEdit(props: any) {

    const { language } = useLanguage();

    function setEmail(s: string) {
        props.setUser((u: any) => ({ ...u, email: s }))
    }

    function setFirstName(s: string) {
        props.setUser((u: any) => ({ ...u, firstName: s }))
    }

    function setLastName(s: string) {
        props.setUser((u: any) => ({ ...u, lastName: s }))
    }

    function setUsername(s: string) {
        props.setUser((u: any) => ({ ...u, username: s }))
    }

    return (
        <>
            <InputSmall
                label={language && language.Email}
                value={props.user.email}
                setValue={setEmail}
                maxLength={40}
                style={{ maxWidth: '200px' }}
            />
            <InputSmall
                label={language && language.profile.FirstName}
                value={props.user.firstName}
                setValue={setFirstName}
                maxLength={40}
                style={{ maxWidth: '200px' }}
            />
            <InputSmall
                label={language && language.profile.LastName}
                value={props.user.lastName}
                setValue={setLastName}
                maxLength={40}
                style={{ maxWidth: '200px' }}
            />
            <InputSmall
                label={language && language.profile.Username}
                value={props.user.username}
                setValue={setUsername}
                maxLength={40}
                style={{ maxWidth: '200px' }}
            />
        </>
    )
}


export default function ProfileUserPref() {

    const { language } = useLanguage();
    const { currentUser, setCurrentUser } = useCurrentUser()

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false)
    const [profileUser, setProfileUser] = useState<User>()


    useEffect(() => {
        if (currentUser) {
            setProfileUser(currentUser)
        }
    }, [currentUser])

    function validInputs(user: User) {
        if (!validateEmail(user.email.trim())) {
            setError("Invalid email")
            return (false);
        }
        if (!validateNames(user.firstName.trim())) {
            setError("Invalid first name");
            return (false);
        }
        if (!validateNames(user.lastName.trim())) {
            setError("Invalid last name")
            return (false)
        }
        if (!validateNames(user.username.trim())) {
            setError("Invalid username")
            return (false)
        }
        return (true)
    }

    const upateUserInfos = useCallback(async () => {
        setError("")
        setSuccess("")
        if (editing) {
            if (profileUser && !validInputs(profileUser))
                return;
            const keys = ["email", "username", "firstName", "lastName", "username"];
            let updateDatas: any = {};
            let update: boolean = false;
            for (let k of keys) {
                if (currentUser[k as keyof User] !== profileUser[k as keyof User]) {
                    if (!update)
                        update = !update;
                    updateDatas[k] = profileUser[k as keyof User];
                }
            }
            if (update) {
                try {
                    const res = await updateUserRequest(updateDatas)
                    setCurrentUser(profileUser)
                    if (res && res.data && res.data.message)
                        setSuccess(res.data.message)
                    else
                        setSuccess("Update user infos succeed")
                }
                catch (err) {
                    setProfileUser(currentUser)
                    if (err && err.response && err.response.data && err.response.data.message)
                        setError(err.response.data.message)
                    else
                        setError("Update user infos failed")
                }
            }
        }
        setEditing((p: boolean) => !p)
    }, [profileUser, currentUser, editing]);

    return (
        <div className="profileuserpref-informations" style={{ position: 'relative' }}>
            {error && <p className="font-14 error-msg" >{error}</p>}
            {success && <p className="font-14 success-msg" >{success}</p>}
            {
                editing ?
                    <ProfileUserPrefEdit user={profileUser} setUser={setProfileUser} />
                    :
                    <>
                        <InfoLabel
                            title={language && language.Email}
                            text={profileUser && profileUser.email || "Not specified"}
                        />
                        <InfoLabel
                            title={language && language.profile.FirstName}
                            text={profileUser && profileUser.firstName || "Not specified"}
                        />
                        <InfoLabel
                            title={language && language.profile.LastName}
                            text={profileUser && profileUser.lastName || "Not specified"}
                        />
                        <InfoLabel
                            title={language && language.profile.Username}
                            text={profileUser && profileUser.username || "Not specified"}
                        />
                    </>
            }
            <div className="profileuserpref-informations-editicon" >
                <RoundIconBorder
                    icon={editing ? checkIconBlack : pencilIconBlack}
                    onClick={upateUserInfos}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
        </div>
    )
}
