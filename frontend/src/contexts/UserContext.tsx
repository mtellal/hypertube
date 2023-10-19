import { createContext, useContext, useEffect, useState } from "react";


export type TCurrentUser = {
    currentUser: any
    setCurrentUser: (u: any | ((u: any) => any)) => void
    addBlockUserId: (id: string) => void,
    removeBlockUserId: (id: string) => void
}

const UserContext: React.Context<TCurrentUser> = createContext(null)

export function useCurrentUser() {
    return (useContext(UserContext))
}

export function UserProvider({ children, _user, token, userId }: any) {

    const [currentUser, setCurrentUser] = useState({
        blockIds: []
    });



    useEffect(() => {
        if (_user) {
            setCurrentUser((u: any) => ({ ...u, ..._user }));
        }
    }, [_user])

    function addBlockUserId(blockUserId: string) {
        setCurrentUser((u: any) => ({ ...u, blockIds: u.blockIds && u.blockIds.length ? [...u.blockIds, blockUserId] : [blockUserId] }))
    }

    function removeBlockUserId(blockUserId: string) {
        setCurrentUser((u: any) => ({ ...u, blockIds: u.blockIds.filter((id: string) => id !== blockUserId) }))
    }


    return (
        <UserContext.Provider value={{
            currentUser,
            setCurrentUser,
            addBlockUserId,
            removeBlockUserId
        }}>
            {children}
        </UserContext.Provider>
    )
}