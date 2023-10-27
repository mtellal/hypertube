import { MutableRefObject, ReactNode, createContext, useContext, useRef, useState } from "react"


import './ModalPage.css'

type TModalContext = {
    setShowModal: (p: boolean | ((p: boolean) => void)) => void,
    modalRef: MutableRefObject<any>
}

export const ModalContext: React.Context<TModalContext> = createContext({
    setShowModal: (p: boolean) => {},
    modalRef: null
})

export function useModalPage() {
    return (useContext(ModalContext))
}

type ModalPageProps = {
    children: ReactNode
}

export function ModalPage({ children }: ModalPageProps) {

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