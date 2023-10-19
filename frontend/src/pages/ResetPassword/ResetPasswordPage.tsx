
import './ResetPasswordPage.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useNavigate } from 'react-router';
import { updatePasswordRequest } from '../../requests';
import { useSearchParams } from 'react-router-dom';

import { InputIconPassword } from '../../components/Inputs/InputIconPassword/InputIconPassword';
import { useLanguage } from '../../contexts/language';

type Tsigninpage = any | {
    user: any,
    status: string
}


export default function ResetPasswordPage(props: Tsigninpage) {

    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [urlParams, searchParams] = useSearchParams();
    const { language } = useLanguage();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (params && !params.get("token"))
            navigate("/signin")
    }, [])

    const translateMessage = useCallback((msg: string) => {
        if (language) {
            if (msg === "Session expired, please ask a new mail")
                return (language.resetPassword.SessionExpired)
            else if (msg === "Password required")
                return (language.resetPassword.PasswordRequired)
            else if (msg === "Confirm password required")
                return (language.resetPassword.ConfirmPasswordRequired)
            else if (msg === "Password and Confirm password different")
                return (language.resetPassword.passDifferents)
        }
        return (msg)
    }, [language])

    function handleError(err: any) {
        if (err.response.data && err.response.data.message) {
            if (err.response.data.message === "Invalid token")
                setError(translateMessage("Session expired, please ask a new mail"));
            else
                setError(err.response.data.message);
        }
        else
            setError(err.responde.statusText);
    }


    function handleSuccess(res: any) {
        if (res.data && res.data.message) {
            navigate("/signin", { state: { message: "Password updated" } })
        }
    }

    async function onSubmit() {
        setError("");
        setSuccess("");
        const _password = password.trim();
        const _confirmPassword = confirmPassword.trim();
        if (!_password)
            return (setError(translateMessage("Password required")));
        if (!_confirmPassword)
            return (setError(translateMessage("Confirm password required")));
        if (_password !== _confirmPassword)
            return (setError(translateMessage("Password and Confirm password different")));
        await updatePasswordRequest(urlParams.get("token"), _password)
            .then(res => handleSuccess(res))
            .catch(err => handleError(err))
    }

    function resetInfo() {
        setError("");
        setSuccess("");
    }

    return (
        <div className="resetpage-c" >
            <div className="resetpage-title-c">
                <p className='resetpage-title'>{language && language.resetPassword.title}</p>
                <span className='resetpage-title-pink'>{language && language.Password}</span>
            </div>
            <p className='resetpage-description'>{language && language.resetPassword.titleDesc}</p>

            <div className='resetpage-input-c' style={{ position: 'relative' }}>
                {error && <p style={{ margin: '0', position: 'absolute', top: '-5vh', color: 'var(--red)' }}>{error}</p>}
                {success && <p style={{ margin: '0', position: 'absolute', top: '-5vh', color: 'var(--green)' }}>{success}</p>}

                <InputIconPassword
                    placeholder={language && language.resetPassword.NewPassword}
                    value={password}
                    setValue={setPassword}
                    maxLength={30}
                    onSubmit={onSubmit}
                    onChange={resetInfo}
                />

                <InputIconPassword
                    placeholder={language && language.resetPassword.ConfirmNewPassword}
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    maxLength={30}
                    onSubmit={onSubmit}
                    onChange={resetInfo}
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonLarge
                        title="Reset"
                        style={{ marginTop: '2vh' }}
                        onClick={onSubmit}
                    />
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <p className='resetpage-fpass-raw'>{language && language.haveAccount}</p>
                        <p onClick={() => navigate("/signin")} className='resetpage-fpass' style={{ paddingLeft: '5px' }}>{language && language.authenticateHere}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}