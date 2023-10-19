import { Request, Response } from 'express'
import { authorizationUrl, getGoogleUserData, get42UserData, createAccount } from '../services/oauth.services';
import UserService from '../services/user.service'

const jwt = require('jsonwebtoken')

export async function oauth(req: Request, res: Response) {
    if (!req.query.school42 && !req.query.google)
        return (res.status(400).json({ message: "require param domain oauth2" }))
    try {
        if (req.query.school42 &&
            process.env.SCHOOL42_CLIENT_ID &&
            process.env.SCHOOL42_REDIRECT_URI) {
            return (res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.SCHOOL42_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.SCHOOL42_REDIRECT_URI)}&response_type=code`))
        }
        else if (req.query.google) {
            if (process.env.GOOGLE_CLIENT_ID &&
                process.env.GOOGLE_CLIENT_SECRET &&
                process.env.GOOGLE_REDIRECT_URL)
                return (res.redirect(authorizationUrl))
        }
    }
    catch (e) {
        // console.log(e)
        console.log("Error: redirection to third party failed")
    }
    return (res.status(404).json({ message: "Error: redirection to third party failed" }))
}

export async function oauthRedirect(req: Request, res: Response) {
    if (!req.query.code)
        return (res.redirect(String(process.env.FRONT_URI)));
    try {
        let user = null;
        if (req.query.google) {
            user = await getGoogleUserData(String(req.query.code))
        }
        else {
            user = await get42UserData(String(req.query.code))
        }
        if (!user)
            throw "User not found";
        let userId = await UserService.getUserDataFieldFromField("userId", "email", user.email)
        if (!userId) {
            userId = await createAccount(user)
            if (!userId)
                throw "";
        }
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3h' });
        return (res.redirect(`${process.env.FRONT_URI}/profile?token=${token}`));
    }
    catch (e) {
        // console.log(e)
        console.log("Error: identification from third party failed")
    }
    return (res.redirect(`${process.env.FRONT_URI}/profile`));
}


export default {
    oauth,
    oauthRedirect
}