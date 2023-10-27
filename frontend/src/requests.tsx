import axios from "axios";

const apiURL = `http://${process.env.REACT_APP_BACK_DOMAIN}:${process.env.REACT_APP_BACK_PORT}`

axios.defaults.withCredentials = true;

//////////////////////////////////////////////////////////////
//                         U S E R                          //
//////////////////////////////////////////////////////////////

/* ////////////////////         G E T      //////////////////// */

export async function getUserRequest(id: string | number | null = null) {
    if (id)
        return (axios.get(`${apiURL}/user/${id}`))
    else
        return (axios.get(`${apiURL}/user`))
}

export async function getUserPhotoRequest(userId: number) {
    return (
        axios.get(`${apiURL}/user/photo/${userId}`, {
            responseType: 'blob',
        })
    )
}

/* ////////////////////         P O S T     //////////////////// */

export async function signinRequest(username: string, password: string) {
    return (
        axios.post(`${apiURL}/user/signin`, {
            username,
            password
        })
    )
}

type DataSignupRequest = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
}

export async function signupRequest(data: DataSignupRequest) {
    return (
        axios.post(`${apiURL}/user/signup`, {
            email: data.email,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password
        })
    )
}

export async function resetPasswordRequest(email: string) {
    return (
        axios.patch(`${apiURL}/user/resetPassword`, {
            email
        })
    )
}

export async function updatePasswordRequest(token: string, password: string) {
    return (
        axios.patch(`${apiURL}/user/updatePassword`, {
            password,
            token
        })
    )
}

type DataUpdateUserRequest = {
    email?: string,
    firstName?: string,
    lastName?: string,
    username?: string
}

export async function updateUserRequest(user: DataUpdateUserRequest) {
    return (
        axios.patch(`${apiURL}/user/update`, { ...user })
    )
}

export async function updatePhotosRequest(photoFile: File) {
    const formFiles = new FormData();
    formFiles.append('file', photoFile)
    return (
        axios.patch(`${apiURL}/user/photos`, formFiles, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    )
}


//////////////////////////////////////////////////////////////
//                          M O V I E                       //
//////////////////////////////////////////////////////////////

export type MovieRequest = null | {
    movie?: string,
    imdb_code?: string,
    page?: string | number
}

export async function getMovieRequest(options: MovieRequest) {
    return (axios.get(`${apiURL}/movie?imdb_code=${options.imdb_code || ""}&movie=${options.movie || ""}&page=${options.page}`))
}

export async function getMovieDetailsRequest(imdb_id: string) {
    return (axios.get(`${apiURL}/movie/${imdb_id}`))
}


//////////////////////////////////////////////////////////////
//                     S U B T I T L E S                    //
//////////////////////////////////////////////////////////////

export async function getMovieSubtitlesRequest(title: string,
    imdb_code: string, preferredLanguage: string = "english") {
    return (axios.get(`${apiURL}/subtitles/list?title=${title}&imdb_code=${imdb_code}&preferredLanguage=${preferredLanguage}`))
}

//////////////////////////////////////////////////////////////
//                       C O M M E N T S                    //
//////////////////////////////////////////////////////////////

export async function postCommentRequest(imdb_code: string, text: string | number) {
    return (axios.post(`${apiURL}/comments/${imdb_code}`, { text }))
}