
import './Header.css'

import { ButtonBorder, ButtonBorderMenu } from "../Buttons/ButtonBorder";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";


import { useNavigate } from "react-router";
import useWindowDimensions from '../../hooks/useWindowDimensions';
import MobileHeaderMenu from './MobileHeaderMenu/MobileHeaderMenu';
import movieClapper from '../../assets/movie-clapper-open-svgrepo-com.svg'
import { useCurrentUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/language';

import languages from '../../languages/languages';

type TUserInfos = {
    language: any
}

function UserInfos(props: TUserInfos) {

    const { currentUser } = useCurrentUser();
    const navigate = useNavigate();

    return (
        <div className="header-c2-user">
            <ProfilePicture
                userId={currentUser && currentUser.userId}
                style={{ height: '50px', width: '50px' }}
                url={currentUser && currentUser.photo}
                onClick={() => navigate("/profile")}
            />
            <p className="header-c2-username">{currentUser && currentUser.firstName}</p>
            <ButtonBorder
                style={{ marginLeft: '2vw', padding: '15px' }}
                title={props.language && props.language.header.logout}
                onClick={() => navigate("/signin")}
            />
        </div >
    )
}


export function LanguagesPref() {

    const { setLanguage } = useLanguage();

    function handleChange(e: any) {
        if (e.target.value) {
            for (let [key, value] of Object.entries(languages)) {
                if (key === e.target.value) {
                    localStorage.setItem("prefLanguage", key)
                    setLanguage(value)
                }
            }
        }
    }

    const languagesTab = ["english", "chinese", "french", "spanish"]

    return (
        <div className='header-select-c'>
            <select className='header-select' id="lang" onChange={handleChange} defaultValue={localStorage.getItem("prefLanguage") || "english"}>
                {
                    languagesTab.map((l: string) =>
                        <option key={l} value={l}>{l}</option>
                    )
                }
            </select>
        </div>
    )
}


type THeaderProps = {
    status: string
}

export default function HeaderConnected({ status }: THeaderProps) {

    const { width } = useWindowDimensions();

    const navigate = useNavigate();
    const { language } = useLanguage();

    return (
        <header className="header" >

            <div className="header-c1" >
                <img className="header-logo" onClick={() => navigate("/profile")} src={movieClapper} />
                <h2 className="header-name" >Hypertube</h2>
            </div>
            {
                status === "connected" ?
                    <>
                        {
                            width <= 900 ?
                                <MobileHeaderMenu />
                                :
                                <div className="header-menu">
                                    <ButtonBorderMenu
                                        title={language && language.header.profile}
                                        onClick={() => navigate("/profile")}
                                    />
                                    <ButtonBorderMenu
                                        title={language && language.header.search}
                                        onClick={() => { navigate("/search") }}
                                    />
                                </div>
                        }
                        <UserInfos language={language} />
                    </> :
                    <div className="header-c2">
                        <ButtonBorder title="Login" onClick={() => navigate("/signin")} />
                    </div>
            }
            <LanguagesPref />

        </header>
    )
}
