import pool from "~/db";
import subtitlesService from "../services/subtitles.service";

const SubtitlesTable = `subtitles`

/*

  `id` PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `imdb_code` CHAR(9)  NOT NULL, 
    `langage` CHAR(100) NOT NULL, 
    `path` CHAR(100) NOT NULL, 

*/


const getSubtitlesFromIMDB = exports.getSubtitlesFromIMDB = async (imdb_code: string) => {
    const query = `SELECT * FROM ${SubtitlesTable} WHERE imdb_code=? ;`
    return (await pool.query(query, [imdb_code]))
}

const getSubtitleFromId = exports.getSubtitleFromId = async (id: string | number) => {
    const query = `SELECT * FROM ${SubtitlesTable} WHERE id=? ;`
    return (await pool.query(query, [id]))
}

const insertSubtitle = async (imdb_code: string, langage: string, path: string) => {
    const query = `INSERT INTO ${SubtitlesTable}(imdb_code, langage, path) VALUES(?, ?, ?);`
    return (await pool.query(query, [imdb_code, langage, path]))
}

export default {
    getSubtitlesFromIMDB,
    getSubtitleFromId,
    insertSubtitle
}