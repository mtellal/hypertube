import axios from 'axios';
import { FormData } from 'formdata-node';
import fs from 'fs'
import UserService from '../services/user.service'

const { google } = require('googleapis')
const crypto = require('crypto')

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

export const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: scopes,
    include_granted_scopes: true
})

export type TOauthUser = {
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    photoURL: string
}

export async function uploadFile(filename: string, url: string) {
    const writer = fs.createWriteStream(`./uploads/${filename}`)
    const res = await axios.get(url, { responseType: 'stream' })
    return (new Promise<void>((resolve) => {
        res.data
            .on('end', () => { resolve(); })
            .pipe(writer);
    }))
}

export async function createAccount(user: TOauthUser) {
    let userId = null;
    const datas = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        omniAuth: true,
    }
    userId = await UserService.createUser(datas)
    try {
        let filename = crypto.randomBytes(12).toString('hex');
        await uploadFile(filename, user.photoURL);
        UserService.updateUserDataFieldFromUserId("photoPath", filename, userId)
    }
    catch (e) {
        // console.log(e)
        console.log("Error: third party profile picture upload failed ")
    }
    return (userId)
}

export async function getGoogleUserData(code: string) {
    let userGoogle = null
    let { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const service = google.people({ version: 'v1', auth: oauth2Client });
    await service.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,photos',
    })
        .then((res: any) => {
            if (res && res.status === 200 && res.data &&
                res.data.names && res.data.names[0] && res.data.names[0].givenName &&
                res.data.emailAddresses && res.data.emailAddresses[0] && res.data.emailAddresses[0].value &&
                res.data.photos && res.data.photos[0] && res.data.photos[0].url) {
                userGoogle = {
                    email: res.data.emailAddresses[0].value,
                    username: res.data.names[0].givenName,
                    firstName: res.data.names[0].givenName,
                    lastName: res.data.names[0].familyName,
                    photoURL: res.data.photos[0].url
                };
            }
        })
    return (userGoogle)
}

export async function get42UserData(code: string) {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code')
    formData.append('client_id', process.env.SCHOOL42_CLIENT_ID);
    formData.append('client_secret', process.env.SCHOOL42_CLIENT_SECRET);
    formData.append('code', code);
    formData.append('redirect_uri', process.env.SCHOOL42_REDIRECT_URI);

    let user42: Partial<TOauthUser> = {};
    let userSet = false;
    let token42: any = null;

    await axios.post('https://api.intra.42.fr/oauth/token', formData)
        .then(async (res: any) => {
            if (res && res.status === 200 && res.data && res.data.access_token) {
                token42 = res.data.access_token;
            }
        })
        .catch((err: any) => {
            console.log("Error: api.intra.42/oauth/token failed ")
            // console.log(err)
        })

    if (!token42)
        throw "Token 42 not found"

    await axios.get("https://api.intra.42.fr/v2/me",
        { headers: { Authorization: `Bearer ${token42}` } })
        .then((res: any) => {
            user42.email = res.data.email;
            user42.firstName = res.data.first_name;
            user42.lastName = res.data.last_name;
            user42.username = res.data.login;
            user42.photoURL = res.data.image.link;
            userSet = true;
        })
        .catch((err: any) => {
            console.log("Error: api.intra.42/me failed ")
            // console.log(err)
        })
    if (userSet)
        return (user42 as TOauthUser)
    return (null);
}

export default {
    createAccount,
    get42UserData,
    getGoogleUserData
}