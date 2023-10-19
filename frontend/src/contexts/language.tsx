import { createContext, useContext, useEffect, useState } from "react";
import languages from '../languages/languages'

type TLanguageContext = {
    language: any,
    setLanguage: (s: any) => void
}

const LanguageContext = createContext<TLanguageContext>({
    language: "",
    setLanguage: () => {}
})


export function useLanguage() {
    return (useContext(LanguageContext))
}

export function LanguageProvier({ children }: any) {
    const [language, setLanguage] = useState(languages.english)

    useEffect(() => {
        if (languages) {
            const prefLang = localStorage.getItem("prefLanguage")
            if (prefLang) {
                for (let [key, value] of Object.entries(languages)) {
                    if (key === prefLang)
                        setLanguage(value)
                }
            }
        }
    }, [languages])

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}