import { createContext, useContext, useRef, useState } from "react"


import './ModalPage.css'

type TModalContext = {
    setShowModal: (p: boolean | ((p: boolean) => any)) => void,
    modalRef: any
}

export const ModalContext: React.Context<TModalContext> = createContext({
    setShowModal: (p: boolean) => {},
    modalRef: null
})

export function useModalPage() {
    return (useContext(ModalContext))
}

export function ModalPage({ children }: any) {

    const [showModal, setShowModal] = useState(false);

    const modalRef = useRef();

    return (
        <ModalContext.Provider
            value={{
                setShowModal,
                modalRef
            }}
        >
            <div style={{ position: 'relative' }}>
                {children}
            </div>
            {
                showModal &&
                <div className="modalpage">
                    {modalRef.current}
                </div>
            }
        </ModalContext.Provider>
    )
}