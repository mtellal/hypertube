import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ButtonBorderMenu } from "../../Buttons/ButtonBorder";

import './MobileHeaderMenu.css'
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";
import { useLanguage } from "../../../contexts/language";

type TPath = {
    title: string,
    route: string
}

export default function MobileHeaderMenu() {

    const { language } = useLanguage()
    const navigate = useNavigate();
    const location = useLocation();

    const [paths, setPaths] = useState<TPath[]>([]);
    const [picking, setPicking] = useState(false);
    const buttonRef = useRef(null);

    useOutsideComponent(buttonRef, () => {
        setPicking(false)
    })

    useEffect(() => {
        if (location && location.pathname) {
            setPaths([{ title: language.header.profile, route: "profile" }, { title: language.header.search, route: "search" }])
        }
    }, [location, language])

    const handlePick = useCallback((path: TPath) => {
        setPicking((p: boolean) => !p)
        if (location.pathname !== path.route || !location.pathname.startsWith(path.route)) {
            navigate(`/${path.route}`)
        }
    }, [location])

    return (
        <div className="mobileheadermenu">
            <div ref={buttonRef} className="mobileheadermenu-button">
                {
                    paths && paths.length > 0 &&
                    <ButtonBorderMenu
                        title={paths[0].title}
                        style={{ backgroundColor: 'var(--purple2)' }}
                        onClick={() => setPicking((p: boolean) => !p)} />
                }
                {
                    picking && paths.length > 0 &&
                    <div className="mobileheader-menu">
                        {
                            paths.map((p: TPath) => <p key={p.route} onClick={() => handlePick(p)}>{p.title}</p>)
                        }
                    </div>
                }
            </div>
        </div>
    )
}