
import './SignupPage.css'
import Input from '../../components/Inputs/Input/Input';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signupRequest } from '../../requests';
import { InputIconPassword } from '../../components/Inputs/InputIconPassword/InputIconPassword';
import { ButtonWrapper } from '../../components/Buttons/ButtonWrapper';

import arrowRightIcon from '../../assets/Arrow_Right.svg'
import { validateEmail, validateNames } from '../../utils';
import { useLanguage } from '../../contexts/language';

type TForm = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
}

export default function SignupPage() {

    const { language } = useLanguage();

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',

    });

    async function onSignup() {
        setError("");
        let _form: any = form;
        for (let [key, value] of Object.entries(_form)) {
            _form[key] = (value as string).trim();
        }
        const keys = Object.keys(_form);
        const values: string[] = Object.values(_form);
        let emptyOne = values.findIndex((s: string) => !s);
        if (emptyOne !== -1)
            return (setError(`${keys[emptyOne]} required`));
        if (_form.password !== _form.confirmPassword)
            return (setError("password and confirm password different"));
        if (!validateEmail(form.email))
            return (setError("Invalid email address"))
        if (!validateNames(form.firstName))
            return (setError("Invalid first name"))
        if (!validateNames(form.lastName))
            return (setError("Invalid last name"))
        try {
            const res = await signupRequest(_form)
            if (res && res.status === 200 && res.data && res.data.token) {
                navigate("/profile")
            }
        }
        catch (err) {
            if (err.response.data && (err.response.data as any).message)
                setError((err.response.data as any).message)
            else
                setError(err.response.statusText)
        }
    }

    return (
        <div className="signuppage-c">
            <div className="signuppage-title-c">
                <p className='signuppage-title'> {language && language.signup.title}</p>
                <span className='signuppage-title-pink'>{language && language.Account}</span>
            </div>
            <p className='signuppage-description'>{language && language.signup.titleDesc}</p>

            <div className='signuppage-input-c' style={{ position: 'relative' }}>
                {error && <p className='signuppage-error error-msg' style={{ top: '0', position: 'absolute' }}>{error}</p>}
                <Input
                    placeholder={language && language.Email}
                    value={form.email}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, email: v }))}
                    maxLength={40}
                />
                <Input
                    placeholder={language && language.Username}
                    value={form.username}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, username: v }))}
                    maxLength={40}
                />
                <Input
                    placeholder={language && language.profile.FirstName}
                    value={form.firstName}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, firstName: v }))}
                    maxLength={40}
                />
                <Input
                    placeholder={language && language.profile.LastName}
                    value={form.lastName}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, lastName: v }))}
                    maxLength={40}
                />
                <InputIconPassword
                    placeholder={language && language.Password}
                    value={form.password}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, password: v }))}
                    maxLength={40}
                />
                <InputIconPassword
                    placeholder={language && language.ConfirmPassword}
                    value={form.confirmPassword}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, confirmPassword: v }))}
                    maxLength={40}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonWrapper onClick={onSignup} >
                        <h1 className='buttonlarge-title'>{language && language.Continue}</h1>
                        <img src={arrowRightIcon} style={{ marginLeft: '15px' }} />
                    </ButtonWrapper>
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <p className='signuppage-fpass-raw'>{language && language.haveAccount}</p>
                        <p
                            onClick={() => navigate("/")}
                            className='signuppage-fpass'
                            style={{ paddingLeft: '5px' }}
                        >{language && language.authenticateHere}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
