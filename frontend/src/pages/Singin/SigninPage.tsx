

import './SigninPage.css'
import Input from '../../components/Inputs/Input/Input';
import { useEffect, useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useLocation, useNavigate } from 'react-router';
import { signinRequest } from '../../requests';
import { AxiosError, AxiosResponse } from 'axios';
import { InputIconPassword } from '../../components/Inputs/InputIconPassword/InputIconPassword';

import icon42 from '../../assets/42Icon.svg'
import iconGoogle from '../../assets/googleIcon.svg'
import { ButtonIcon } from '../../components/Buttons/ButtonIcon';

import { useLanguage } from '../../contexts/language';

export default function SigninPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const {language} = useLanguage();

    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (location.state && location.state.message)
            setMessage(location.state.message);
    }, [])

    function handleError(error: AxiosError) {
        if (error.response.data && (error.response.data as any).message) {
            setError((error.response.data as any).message);
        }
        else
            setError(`Error: ${error.response.statusText}`);
    }

    function handleSuccess(res: AxiosResponse) {
        if (res.data && res.data.token) {
            navigate("/profile");
        }
    }

    async function onSignin() {
        let _username = username.trim();
        let _password = password.trim();
        if (!_username)
            return (setError("Username required"));
        if (!_password)
            return (setError("Password required"));
        await signinRequest(_username, _password)
            .then(res => handleSuccess(res))
            .catch(err => handleError(err))
    }

    return (
        <div className="signinpage-c" >
            <div className="signinpage-title-c">
                <p className='signinpage-title'>{language && language.signin.title}</p>
                <span className='signinpage-title-pink'>{language && language.Account}</span>
            </div>
            <p className='signinpage-description'>{language && language.signin.titleDesc}</p>

            {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
            {message && <p style={{ color: 'var(--green)' }}>{message}</p>}
            <div className='signinpage-input-c' style={{ position: 'relative' }}>
                <Input
                    placeholder={language && language.Username}
                    value={username}
                    setValue={setUsername}
                    maxLength={40}
                    onSubmit={onSignin}
                    onChange={() => setError("")}
                />

                <div className='signinpage-pass'>
                    <InputIconPassword
                        placeholder={language && language.Password}
                        value={password}
                        setValue={setPassword}
                        maxLength={40}
                        onSubmit={onSignin}
                        onChange={() => setError("")}
                    />
                    <p onClick={() => navigate("/signin/password")} className='signinpage-fpass'>{language && language.signin.forgetPassword}</p>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className='signinpage-diffauth'>
                        <a href={`${process.env.REACT_APP_BACK_URI}/oauth?school42=true`}>
                            <ButtonIcon
                                icon={icon42}
                            />
                        </a>
                        <a href={`${process.env.REACT_APP_BACK_URI}/oauth?google=true`}>
                            <ButtonIcon
                                icon={iconGoogle}
                            />
                        </a>

                    </div>
                    <ButtonLarge
                        title={language && language.signin.Signin}
                        style={{ marginTop: '2vh' }}
                        onClick={onSignin}
                    />
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <p className='signinpage-fpass-raw'>{language && language.signin.noAccount}</p>
                        <p onClick={() => navigate("/signup")} className='signinpage-fpass' style={{ paddingLeft: '5px' }}>{language && language.signin.registerHere}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}