import pool from "~/db";

const moviesWatchedTable = `moviesWatched`

/*
CREATE TABLE `moviesWatched`(
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
    `userId` INT UNSIGNED NOT NULL, 
    `movieHash` VARCHAR(40) NOT NULL, 
    FOREIGN KEY (userId) REFERENCES users(userId)
);

*/

const getMoviesIMDBFromUserId = exports.getMoviesHashFromUserId = async (userId: string | number) => {
    const query = `SELECT imdb_code FROM ${moviesWatchedTable} WHERE userId=? ;`;
    return (await pool.query(query, userId))
}

const isMovieWatchedFromIMDB = exports.isMovieWatchedFromIMDB = async (userId: string | number, imdb_code: string) => {
    const query = `SELECT * FROM ${moviesWatchedTable} WHERE userId=? && imdb_code=? ;`
    return (await pool.query(query, [userId, imdb_code]))
}

const insertMovieWatched = exports.insertMovieWatched = async (userId: string | number, movieHash: string, imdb_code: string) => {
    const query = `INSERT INTO ${moviesWatchedTable} (userId, movieHash, imdb_code) VALUES (?, ?, ?) ;`
    return (await pool.query(query, [userId, movieHash, imdb_code]))
} 


export default {
    getMoviesIMDBFromUserId, 
    isMovieWatchedFromIMDB, 
    insertMovieWatched
}
