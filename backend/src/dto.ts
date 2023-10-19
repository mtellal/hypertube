export interface ICreate {
    id: number, 
    email: string, 
    username: string, 
    firstName: string, 
    lastName: string, 
    password: string, 
    city?: string

    gender?: string, 
    sexualPreferences?: string, 
    biography?: string, 
    tags?: string[], 
    profilePicture?: any, 
    photos?: any[]
}

export const UsersTableFields = [
    "firstName", 
    "lastName", 
    "password", 
    "username", 
    "photos", 
    "city", 
    "likes", 
    "views", 
    "fameRating",
    "status", 
    "lastConnection", 
    "gender", 
    "sexualPreferences", 
    "tags", 
    "biography", 
    "age", 
    "email", 
    "token",
    "moviesWatched",

    "ageGap", 
    "fameRatingGap", 
    "text"
]