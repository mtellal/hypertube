
import './ResetPasswordPage.css'
import { useCallback, useEffect, useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useNavigate } from 'react-router';
import { updatePasswordRequest } from '../../requests';
import { useSearchParams } from 'react-router-dom';

import { InputIconPassword } from '../../components/Inputs/InputIconPassword/InputIconPassword';
import { useLanguage } from '../../contexts/language';

export default function ResetPasswordPage() {

    const navigate = useNavigate();
    const { language } = useLanguage();
    const [params, setParams] = useSearchParams();
    const [urlParams, searchParams] = useSearchParams();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
        try {
            const res = await updatePasswordRequest(urlParams.get("token"), _password)
            if (res.data && res.data.message) {
                navigate("/signin", { state: { message: "Password updated" } })
            }
        }
        catch (err) {
            // console.log(err)
            if (err.response.data && err.response.data.message) {
                if (err.response.data.message === "Invalid token")
                    setError(translateMessage("Session expired, please ask a new mail"));
                else
                    setError(err.response.data.message);
            }
            else
                setError(err.response.statusText);
        }
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
                {error && <p className='error-msg' style={{ position: 'absolute', top: '-5vh' }}>{error}</p>}
                {success && <p className='success-msg' style={{ position: 'absolute', top: '-5vh' }}>{success}</p>}

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
                        <p
                            onClick={() => navigate("/signin")}
                            className='resetpage-fpass'
                            style={{ paddingLeft: '5px' }}
                        >{language && language.authenticateHere}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}