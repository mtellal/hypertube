import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

export type TCurrentUser = {
    currentUser: User | undefined,
    setCurrentUser: (u: User | ((u: User) => void)) => void
}

const UserContext: React.Context<TCurrentUser | undefined> = createContext(undefined)

export function useCurrentUser() {
    return (useContext(UserContext))
}

type UserContextProviderProps = {
    children: ReactNode,
    _user: User
}

export function UserProvider({ children, _user }: UserContextProviderProps) {

    const [currentUser, setCurrentUser] = useState<User>();

    useEffect(() => {
        if (_user) {
            setCurrentUser((u: User) => ({ ...u, ..._user }));
        }
    }, [_user])

    return (
        <UserContext.Provider value={{
            currentUser,
            setCurrentUser
        }}>
            {children}
        </UserContext.Provider>
    )
}