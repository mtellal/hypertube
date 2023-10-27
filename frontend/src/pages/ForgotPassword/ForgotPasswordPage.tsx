
import './ForgotPasswordPage.css'
import Input from '../../components/Inputs/Input/Input';
import { useCallback, useRef, useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useNavigate } from 'react-router';
import { resetPasswordRequest } from '../../requests';
import { useLanguage } from '../../contexts/language';

export default function ForgotPasswordPage() {

    const navigate = useNavigate();
    const { language } = useLanguage();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const emailSend = useRef(false);

    const translateMessage = useCallback((msg: string) => {
        if (language) {
            if (msg === "Mail invalid")
                return (language.forgotPassword.mailInvalid)
            else if (msg === "Mail required")
                return (language.forgotPassword.mailRequired)
            else if (msg === "Mail sucessfuly send")
                return (language.forgotPassword.mailSend)
        }
        return (msg)
    }, [language])

    async function onSubmit() {
        if (emailSend.current)
            return;
        setSuccess("");
        setError("");
        const _email = email.trim();
        if (!_email)
            return (setError(translateMessage("Mail required")));
        await resetPasswordRequest(_email)
            .then(res => {
                if (res && res.data && res.data.message) {
                    emailSend.current = true;
                    setSuccess(translateMessage(res.data.message))
                }
            })
            .catch(err => {
                if (err && err.response && err.response.data && err.response.data.message)
                    setError(translateMessage(err.response.data.message))
            })
    }

    return (
        <div className="frgtpassword-c" >
            <div className="frgtpassword-title-c">
                <p className='frgtpassword-title'>{language && language.forgotPassword.title}</p>
                <span className='frgtpassword-title-pink'>{language && language.Password}</span>
            </div>
            <p className='frgtpassword-description'>{language && language.forgotPassword.titleDesc}</p>
            <div className='frgtpassword-input-c' style={{ position: 'relative' }}>
                {error && <p className='success-msg' style={{ position: 'absolute', top: '-5vh' }}>{error}</p>}
                {success && <p className='error-msg' style={{ position: 'absolute', top: '-5vh' }}>{success}</p>}

                <Input
                    placeholder={language && language.Email}
                    value={email}
                    setValue={setEmail}
                    maxLength={30}
                    onSubmit={onSubmit}
                    onChange={() => { emailSend.current = false }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonLarge
                        title={language && language.forgotPassword.Send}
                        style={{ marginTop: '2vh' }}
                        onClick={onSubmit}
                    />
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <p className='frgtpassword-fpass-raw'>{language && language.haveAccount}</p>
                        <p onClick={() => navigate("/")} className='frgtpassword-fpass' style={{ paddingLeft: '5px' }}>{language && language.authenticateHere}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}