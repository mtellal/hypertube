import pool from '../db';
import { ICreate } from '../dto';


const usersTable = 'users'

/*
    FROM TABLE
    userId
    username
    email
    password
    firstName
    lastName
*/

const getAll = exports.getAll = async () => {
    return (await pool.query("SELECT userId, username, firstName, lastName FROM users;"));
}

const getUserDataFieldFromField = exports.getUserDataFieldFromField = async (dataField: string, field: string, valueField: string) => {
    return (await pool.query(`SELECT ${dataField} FROM ${usersTable} WHERE ${field} = (?);`, [valueField]));
}

const getUserDatasFieldsFromUserId = exports.getUserDatasFieldsFromUserId = async (fields: string[], userId: number) => {
    const query = `SELECT ${fields.map((f: string) => f)} FROM ${usersTable} WHERE userId=${userId};`
    return (await pool.query(query));
}

const createUser = exports.createUser = async (fields: string[], datas: any) => {
    const query = `INSERT INTO ${usersTable} (${fields.map((s: string) => datas[s] ? s : '')}) 
    VALUES (${fields.map(() => '?')})`;

    return (await pool.query(query, fields.map((s: string) => datas[s])));
}

/* //////////////////   U P D A T E     //////////////////*/


const updateUser = exports.updateUser = async (id: number, datas: ICreate) => {
    const keys = Object.keys(datas);

    const query = `UPDATE ${usersTable} \
    SET ${keys.map((s: string) => `${s}='${datas[s as keyof ICreate]}'`)} \
    WHERE id='${id}'`;

    return (await pool.query(query, Object.values(datas)));
}

const updateUserDataFieldFromUserId = exports.updateUserDataFieldFromUserId = async (field: string, dataField: string, userId: string | number) => {
    const query = `UPDATE ${usersTable} SET ${field}=? WHERE userId=?;`;
    return (await pool.query(query, [dataField, userId]))
}

const updateUserDatasFieldsFromUserId = exports.updateUserDatasFieldsFromUserId = async (keys: string[], values: string[], userId: string | number) => {
    const query = `UPDATE ${usersTable} SET ${keys.map((k: string, i: number) => `${k}=?`)} WHERE userId=?;`
    return (await pool.query(query, [...values, userId]));
}
