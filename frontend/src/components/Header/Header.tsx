
import './Header.css'

import movieClapper from '../../assets/movie-clapper-open-svgrepo-com.svg'

import { LanguagesPref } from './HeaderConnected';
import { useNavigate } from 'react-router';

export default function Header() {

    const navigate = useNavigate();
    return (
        <header className="header" >
            <div className="header-c1">
                <img className="header-logo" onClick={() => navigate("/signin")}src={movieClapper} />
                <h2 className="header-name" >Hypertube</h2>
            </div>
           <LanguagesPref />
        </header>
    )
}