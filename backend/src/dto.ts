export interface ICreate {
    id: number, 
    email: string, 
    username: string, 
    firstName: string, 
    lastName: string, 
    password: string, 

    profilePicture?: any, 
    photos?: any[]
}

export const UsersTableFields = [
    "firstName", 
    "lastName", 
    "password", 
    "username", 
    "photos", 
    "lastConnection", 
    "email", 
    "token",
    "moviesWatched",

    "text"
]