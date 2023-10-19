import pool from '../db'
const moviesTable = 'movies'

/*
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `info_hash` VARCHAR(20) NOT NULL,
    `name` CHAR(100) NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `path` CHAR(200) NOT NULL, 
    `path_folfer` CHAR(100) NOT NULL, 
    `type` ENUM('movie', 'vtt') NOT NULL
*/

const getMovieFromName = exports.getMovieFromName = async (name: string) => {
    const query = `SELECT * FROM ${moviesTable} WHERE name=? ;`;
    return (await pool.query(query, [name]))
}

const getMovieFromHashInfo = exports.getMovieFromHashInfo = async (info_hash: string) => {
    const query = `SELECT * FROM ${moviesTable} WHERE info_hash=? ;`;
    return (await pool.query(query, [info_hash]))
}

const insertMovie = exports.insertMovie = async (info_hash: string, imdb_code: string,
    name: string, size: bigint, path: string, path_folfer: string, type: string, status: string) => {
    const query = `INSERT INTO ${moviesTable}(info_hash, imdb_code, name, size, path, path_folfer, type, status) \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?) ;`
    return (await pool.query(query, [info_hash, imdb_code, name, size, path, path_folfer, type, status]))
}

const updateLastView = exports.updateLastView = async (info_hash: string) => {
    const query = `UPDATE ${moviesTable} SET lastView=NOW() WHERE info_hash=? ;`
    return (await pool.query(query, [info_hash]))
}

const getAllMovies = exports.getAllMovies = async () => {
    return (await pool.query(`SELECT * FROM ${moviesTable} ;`))
}

const getUnViewedMovies = exports.getUnViewedMovies = async () => {
    return (await pool.query(`SELECT * FROM ${moviesTable} WHERE lastView < NOW() - INTERVAL 30 DAY;`))

}

const clearUnViewedMovies = exports.clearUnViewedMovies = async () => {
    return (await pool.query(`DELETE FROM ${moviesTable} WHERE lastView < NOW() - INTERVAL 30 DAY;`))
}

const deleteMovieFromName = exports.deleteMovieFromName = async (name: string) => {
    const query = `DELETE FROM ${moviesTable} WHERE name=? ;`;
    return (await pool.query(query, [name]))
}


export default {
    getAllMovies,
    getMovieFromName,
    getMovieFromHashInfo,
    insertMovie,
    updateLastView,
    clearUnViewedMovies,
    deleteMovieFromName,
    getUnViewedMovies
}