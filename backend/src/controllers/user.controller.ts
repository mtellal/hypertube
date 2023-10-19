import { Request, Response } from 'express';
import { ICreate } from '../dto';
import UsersService from '../services/user.service'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');


//////////////////////////////////////////////////////////////////
//                           G E T                              //
//////////////////////////////////////////////////////////////////

export async function getAll(req: Request, res: Response) {
    try {
        const data = await UsersService.getAll();
        return (res.status(200).json({ data, message: "Users found" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "No users found" }));
    }
}

export async function getProfilePicture(req: Request, res: Response) {
    try {
        let pathFile = await UsersService.getUserDataFieldFromField("photoPath", "userId", (req.params.id));
        if (!pathFile)
            throw "Photo not found"
        res.status(200).sendFile(path.join(__dirname, "../../uploads", pathFile))
    }
    catch (e) {
        console.log(e)
        return (res.status(400).json({ mesage: "Photo not found" }))
    }
}

export async function getUserInfos(req: Request, res: Response) {
    try {
        const userId = res.locals.token.id;
        let user = await UsersService.getUserDatas(userId, true);
        if (req.params.id && parseInt(req.params.id) !== userId) {
            user = await UsersService.getUserDatas(req.params.id);
        }
        return (res.status(200).json({ user, message: "User found" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "User not found" }));
    }
}


//////////////////////////////////////////////////////////////////
//                           P O S T                            //
//////////////////////////////////////////////////////////////////

const upload = require('multer')({
    dest: 'uploads/',
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: function (req: Request, file: any, cb: any) {
        const fileSize = req.headers['content-length']
        if (file.mimetype !== "image/jpeg") {
            return (cb(null, false, new Error("Invalid file (image/jpeg required)")))
        }
        else if (Number(fileSize) > 1024 * 1024 * 10) {
            return (cb(null, false, new Error("Invalid file (image/jpeg required)")))
        }
        return (cb(null, true))
    }
}).single('file')

export async function uploadProfilePicture(req: Request | any, res: Response) {
    await new Promise<void>((resolve) => {
        upload(req, res, function (err: any) {
            resolve();
        })
    })
    if (!req.file)
        return (res.status(400).json({ message: "Invalid file (image/jpeg and 10MB max)" }))
    try {
        const userId = res.locals.token.id;
        let filename = req.file.filename;
        await UsersService.updateUserPhotos(userId, filename);
        return (res.status(201).json({ message: "Profile picture uploaded" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(400).json({ message: "Profile picture upload failed" }));
    }
}

export async function signup(req: Request, res: Response) {
    const b: ICreate = req.body;
    if (!b.email || !b.username || !b.firstName || !b.lastName || !b.password)
        return (res.status(400).json({ message: "Missing fields - required [email, username, firstName, lastName, password]" }));
    if (String(b.firstName).length > 40 ||
        String(b.lastName).length > 40 ||
        String(b.username).length > 40 ||
        String(b.email).length > 40 ||
        String(b.password).length > 40)
        return (res.status(400).json({ message: "Invalid [email, username, firstName, lastName]" }));
    try {
        if (await UsersService.dataAlreaydExists("email", b.email))
            return (res.status(400).json({ message: "Email already taken" }));
        if (await UsersService.dataAlreaydExists("username", b.username))
            return (res.status(400).json({ message: "Username already taken" }));

        const id = await UsersService.createUser(req.body)
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.cookie("access_token", token, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 180) });
        return (res.status(200).json({ token, message: "User Created" }));
    }
    catch (e) {
        // console.log(e)
        return (res.status(400).json({ message: "Registration failed" }));
    }
}

export async function signin(req: Request, res: Response) {
    if (!req.body.username)
        return (res.status(400).json({ message: "Username required" }));
    if (!req.body.password)
        return (res.status(400).json({ message: "Password required" }));

    try {
        const hashedPassword = await UsersService.getUserDataFieldFromField("password", "username", req.body.username);
        if (!hashedPassword)
            throw "";
        if (await bcrypt.compare(req.body.password, hashedPassword)) {
            let userId = null;
            userId = await UsersService.getUserDataFieldFromField("userId", "username", req.body.username);
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3h' });
            res.cookie("access_token", token, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 180) });
            return (res.status(200).json({ token, message: 'Signin succeed' }));
        }
        else
            throw "";
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "User not found" }));
    }
}

export async function resetPassword(req: Request, res: Response) {
    if (!req.body.email)
        return (res.status(400).json({ message: "Email required" }));
    try {
        const userId = await UsersService.getUserDataFieldFromField("userId", "email", req.body.email);
        if (!userId)
            throw "Mail invalid";
        const token = jwt.sign({ resetPassword: true, id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const url = `http://${process.env.FRONT_DOMAIN}:${process.env.FRONT_PORT}/signin/resetPassword?token=${token}`;
        await UsersService.sendMail({
            from: process.env.MAIL_ADDRESS,
            to: req.body.email,
            subject: "Change your password",
            text: `Click this link to change your password: ${url}`
        })
        res.status(200).json({ message: "Mail sucessfuly send" })
    }
    catch (e) {
        // console.log(e)
        return (res.status(400).json({ message: "Mail invalid" }))
    }
}

export async function updatePassword(req: Request, res: Response) {
    if (!req.body.password)
        return (res.status(400).json({ message: "Password required" }));
    try {
        let userId = res.locals.token.id;
        const hashedPassword = await bcrypt
            .hash(req.body.password, parseInt(process.env.BCRYPT_SALT as string))
            .then((h: string) => h)
        await UsersService.updateUserDataFieldFromUserId("password", hashedPassword, userId);
        return (res.status(200).json({ message: "Password updated" }));
    }
    catch (e) {
        // console.log(e);
        return (res.status(400).json({ message: "Invalid password" }));
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const userId = res.locals.token.id;
        const keys = [];
        const values = [];
        if (req.body.email) {
            const id = await UsersService.getUserDataFieldFromField("userId", "email", req.body.email)
            if (id && id !== userId)
                return (res.status(400).json({ message: "Email already taken" }))
            keys.push("email");
            values.push(req.body.email)
        }
        if (req.body.username) {
            const id = await UsersService.getUserDataFieldFromField("userId", "username", req.body.username)
            if (id && id !== userId)
                return (res.status(400).json({ message: "Username already taken" }))
            keys.push("username");
            values.push(req.body.username)
        }
        if (req.body.firstName) {
            keys.push("firstName");
            values.push(req.body.firstName)
        }
        if (req.body.lastName) {
            keys.push("lastName");
            values.push(req.body.lastName)
        }
        if (req.body.password) {
            keys.push("password")
            const hashedPassword = await bcrypt
                .hash(req.body.password, parseInt(process.env.BCRYPT_SALT as string))
                .then((h: string) => h)
            values.push(hashedPassword)
        }
        if (keys && keys.length)
            await UsersService.updateUserData(keys, values, userId)
        return (res.status(200).json({ message: "User updated" }))
    }
    catch (e) {
        console.log(e);
        return (res.status(400).json({ message: "User update failed" }))
    }
}

export default {
    getAll,
    getProfilePicture,
    getUserInfos,
    signup,
    signin,
    resetPassword,
    updatePassword,
    updateUser,
    uploadProfilePicture
}
