export type User = {
    userId: number,
    username: string,
    firstName: string,
    lastName: string,
    photoPath: string,
    photo: string,

    moviesWatched?: string[],
    email?: string,
    omniauth?: boolean
}

export type Comment = {
    id: number,
    userId: number,
    imdb_code: string,
    createdAt: Date
}

export type Subtitle = {
    id: number,
    language: string,
    path?: string
}

export type MovieWatched = {
    id: number, 
    movieHash: string,
    imdb_code: string
}