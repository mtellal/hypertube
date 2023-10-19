import MoviesWatchedModel from "~/models/moviesWatched";


const fs = require('fs');
let UserModels = require('../models/user.model');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secureConnection: false,
    requireTLS: true,
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
    }
})

const getAll = exports.getAll = async () => {
    return (await UserModels.getAll());
}

const getUserDatas = exports.getUserDatas = async (userId: string | number, currentUser: boolean = false) => {
    let user = null;
    if (currentUser) {
        user = await UserModels.getUserDatasFieldsFromUserId([
            "userId",
            "username",
            "email",
            "photoPath",
            "firstName",
            "lastName",
            "omniAuth",
            "lastConnection",
        ], userId);
        if (user && user[0]) {
            const imdbTab = await MoviesWatchedModel.getMoviesIMDBFromUserId(userId)
            user[0].moviesWatched = []
            if (imdbTab && imdbTab.length)
                user[0].moviesWatched = imdbTab.map((o: { imdb_code: string }) => o.imdb_code)
        }
    }
    else {
        user = await UserModels.getUserDatasFieldsFromUserId([
            "userId",
            "username",
            "firstName",
            "lastName",
            "photoPath",
        ], userId);
    }
    if (!user || !user.length)
        throw "User not found"
    return (user[0])
}

const getUserDataFieldFromField = exports.getUserDataFieldFromField = async (data: string, field: string, dataField: string | number) => {
    let res = await UserModels.getUserDataFieldFromField(data, field, dataField);
    if (res && res[0])
        return (res[0][data]);
    return (null)
}

const getUserDatasFieldsFromUserId = exports.getUserDatasFieldsFromUserId = async (fields: string[], userId: number | string) => {
    let res = await UserModels.getUserDatasFieldsFromUserId(fields, userId);
    if (res && res.length)
        res = res[0]
    return (res);
}

const updateUserDataFieldFromUserId = exports.updateUserDataFieldFromUserId = async (field: string, dataField: string, userId: string | number) => {
    const res = await UserModels.updateUserDataFieldFromUserId(field, dataField, userId)
    return (res)
}

const updateUserData = exports.updateUserData = async (keys: string[], values: string[], userId: number) => {
    const res = await UserModels.updateUserDatasFieldsFromUserId(keys, values, userId);
    return (res)
}

const updateUserPhotos = exports.updateUserPhotos = async (userId: number, fileName: string) => {
    const _path = await getUserDataFieldFromField("photoPath", "userId", userId);
    if (_path && _path.length) {
        fs.unlink('./uploads/' + _path, (err: any) => {
            if (err)
                console.log("Error: unlink profile picture ", ' ./uploads/' + _path, err)
        })
    }
    return (await updateUserDataFieldFromUserId("photoPath", fileName, userId))
}


const dataAlreaydExists = exports.dataAlreaydExists = async (data: string, email: string) => {
    return (await getUserDataFieldFromField("userId", data, email));
}

const sendMail = exports.sendMail = async (messageOption: any) => {
    new Promise<void>((resolve) => {
        transporter.sendMail(messageOption, function (error: any, info: any) {
            if (error) {
                // console.log(error);
                console.log("Error: sending mail failed")
            }
            if (info) {
                console.log("mail correctly send")
                // console.log(info)
            }
            resolve();
        })
    })
}

type TCreateUser = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    omniAuth?: boolean
    password?: string,
}

const createUser = exports.createUser = async (datas: TCreateUser) => {
    try {
        if (datas.password) {
            await bcrypt
                .hash(datas.password, parseInt(process.env.BCRYPT_SALT as string))
                .then((h: string) => datas.password = h)
        }
        const keys = Object.keys(datas);
        await UserModels.createUser(keys, datas);
        let userId = await getUserDataFieldFromField("userId", "username", datas.username);
        if (!userId)
            throw "User creation failed"
        return (userId);
    }
    catch (e) {
        // console.log(e)
        throw "User creation failed"
    }
}


export default {
    getAll,
    getUserDatas,
    getUserDataFieldFromField,
    getUserDatasFieldsFromUserId,
    dataAlreaydExists,
    sendMail,
    createUser,
    updateUserData,
    updateUserDataFieldFromUserId,
    updateUserPhotos
}


