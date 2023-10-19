import axios from "axios";
import { Request, Response } from "express";
import CommentsService from "~/services/comments.service";
import MoviesService from "~/services/movies.service";

export async function getMovies(req: Request, res: Response) {
    try {
        let r: any = null;
        if (req.query.imdb_code) {
            r = await axios.get(`https://yts.torrentbay.net/api/v2/movie_details.json?imdb_id=${req.query.imdb_code}`)
            if (r && r.data && r.data.data.movie && r.data.data.movie.imdb_code === "tt")
                throw ""
        }
        else if (req.query.movie) {
            r = await axios.get(`https://yts.torrentbay.net/api/v2/list_movies.json?sort_by=like_count&page=${req.query.page || 1}&query_term=${req.query.movie}`)
        }
        else {
            r = await axios.get(`https://yts.torrentbay.net/api/v2/list_movies.json?sort_by=like_count&page=${req.query.page || 1}`)
        }
        if (!r)
            throw "";
        if (!r.data)
            r.data = [];
        res.status(200).json({ data: r.data, message: "Data successfully sent" })
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Movies not found" }))
    }
    return (res)
}

export async function getMovieByIMDB(req: Request, res: Response) {
    if (!req.params.imdb_id)
        return (res.status(400).json({ message: "imdb_id required" }))
    try {
        let data = {};

        const _infos = await (axios.get(`https://api.themoviedb.org/3/movie/${req.params.imdb_id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
                accept: 'application/json',
            }
        }))

        if (_infos && _infos.data)
            data = _infos.data;

        const _credits = await (axios.get(`https://api.themoviedb.org/3/movie/${req.params.imdb_id}/credits`, {
            headers: {
                Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
                accept: 'application/json',
            }
        }))
        if (_credits && _credits.data)
            data = { ...data, ..._credits.data };

        const comments = await CommentsService.getComments(req.params.imdb_id);
        if (comments)
            data = { ...data, comments }
        res.status(200).json({ data, message: "Data successfully sent" })
    }
    catch (e) {
        // console.log(e)
        res.status(404).json({ message: "Movie not found" })
    }
    return (res)
}

export async function stream(req: Request, res: Response) {
    if (!req.query.imdb_code || !req.query.hash)
        return (res.status(400).json({ message: "Query params required" }))
    try {
        await MoviesService.handleStream(req, res)
    }
    catch (e) {
        // console.log(e)
        res.status(429).json({ message: "Stream request failed (verify query params)" })
    }
    return (res)
}


export default {
    getMovies,
    getMovieByIMDB,
    stream
}