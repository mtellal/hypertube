import pool from '../db';

const commentsTable = 'comments';

/*
   `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `userId` INT UNSIGNED NOT NULL, 
    `text` TEXT(400) NOT NULL,
    `imdb_code` CHAR(9) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT NOW(),
*/

const getComments = exports.getComments = async (imdb_code: string | number) => {
    const query = `SELECT id, comments.userId, text, imdb_code, createdAt, users.username \
    FROM ${commentsTable} \
    JOIN users ON comments.userId=users.userId WHERE imdb_code=? \
    ORDER BY createdAt DESC ;`
    return (await pool.query(query, [imdb_code]))
}

const insertComment = exports.insertComment = async (userId: string | number, imdb_code: string | number, text: string | number) => {
    const query = `INSERT INTO ${commentsTable}(userId, imdb_code, text) VALUES(?, ?, ?) ;`;
    return (await pool.query(query, [userId, imdb_code, text]))
} 