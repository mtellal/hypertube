import { Response, Request, NextFunction } from 'express';
import { UsersTableFields } from '../dto'

const jwt = require('jsonwebtoken');

const CleanBodyFields = exports.CleanBodyFields = (req: Request, res: Response, next: NextFunction) => {
    const cleanedBody: any = {};
    const bodyFields = Object.keys(req.body);
    bodyFields.map((f: string) => UsersTableFields.find((f2: string) => f2 == f) && req.body[f] ?
        cleanedBody[f] = req.body[f] : null);
    req.body = cleanedBody;
    next();
}

function extractCookie(cookies: string | undefined, key: string) {
    if (!cookies || !cookies.length)
        return (null)
    let tab = cookies.split("; ");
    for (let data of tab) {
        let cookie = data.split("=");
        if (cookie[0] === key)
            return (cookie[1])
    }
    return (null)
}

const JWTAuthentification = exports.JWTAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: any = req.headers['authorization']?.split(" ")[1];
        if (!token) {
            token = extractCookie(req.headers.cookie, "access_token")
        }
        if (!token || token === "null")
            throw "Authorization empty";
        token = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log("token found => ", token);
        res.locals.token = token;
        next();
    }
    catch (e) {
        // console.log("token not found", e);
        return (res.status(401).json({ message: "Token invalid" }));
    }
}

export default {
    CleanBodyFields,
    JWTAuthentification
}