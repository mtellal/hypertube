const mariadb = require('mariadb');

const pool = mariadb.createPool({
    database: process.env.MARIADB_DATABASE,
    host: 'mariadb',
    port: '3306',
    user: 'root',
    password: process.env.MARIADB_ROOT_PASSWORD,
    multipleStatements: true,
    acquireTimeout: 20000,
    connectionLimit: 20
})

export default pool;