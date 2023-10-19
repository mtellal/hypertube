import { spawn } from "child_process";
import { Request, Response } from "express";
import fs from 'fs'
import path from "path";
import MoviesModel from "~/models/movies.model";
import MoviesWatchedModel from "~/models/moviesWatched";

const torrentStream = require('torrent-stream')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const cron = require('node-cron')

const mo = 1024 * 1024;
const bytesChunck = 10 * mo;
export let movieDownloading: any[] = [];

const extensions = [".3gp", ".avi", ".asf", ".flv", ".mkv", ".mpg", ".mpeg", ".mxf", ".ogg", ".mov", ".qt"]

ffmpeg.setFfmpegPath(ffmpegPath)


cron.schedule(' * * 1 * *', async () => {
    const moviesUnviewed = await MoviesModel.getUnViewedMovies();
    if (moviesUnviewed && moviesUnviewed.length) {
        moviesUnviewed.map((m: any) => {
            try {
                if (m.path_folfer)
                    fs.rmSync(path.resolve(process.cwd(), './torrents/' + m.path_folfer), { recursive: true, force: true });
            }
            catch (e) {
                // console.log(e)
            }
        })
    }
    await MoviesModel.clearUnViewedMovies();
    console.log("Movies unviewed from 1 month were been deleted")
})

const getMovieFromName = exports.getMovieFromName = async (name: string) => {
    const res = await MoviesModel.getMovieFromName(name);
    if (res && res.length)
        return (res[0])
    return (null)
}

const getMovieFromHashInfo = exports.getMovieFromHashInfo = async (info_hash: string) => {
    const res = await MoviesModel.getMovieFromHashInfo(info_hash);
    if (res && res.length) {
        return (res[0])
    }
    return (null)
}

const insertMovie = exports.insertMovie = async (info_hash: string, imdb_code: string,
    name: string, size: bigint, path: string, path_folfer: string, type: string, status: string) => {
    return (await MoviesModel.insertMovie(info_hash, imdb_code, name, size, path, path_folfer, type, status))
}

const deleteMovieFromName = exports.deleteMovieFromName = async (name: string) => {
    return (await MoviesModel.deleteMovieFromName(name))
}

const deleteMovieFromIMDB = exports.deleteMovieFromIMDB = async (imdb_code: string) => {
    return (await MoviesModel.deleteMovieFromName(imdb_code))
}

export async function handleStream(req: Request, res: Response) {
    let dbFile = null;
    let statFile = null;

    let currentMovie = null;
    if (movieDownloading.length) {
        currentMovie = movieDownloading.find((m: any) => m.hash === req.query.hash)
    }
    if (!currentMovie) {
        currentMovie = new Movie(String(req.query.hash), String(req.query.imdb_code));
        movieDownloading.push(currentMovie);
        await currentMovie.init();
    }
    else {
        dbFile = await getMovieFromHashInfo(String(req.query.hash));
        statFile = fs.statSync('./torrents/' + dbFile.path)
    }
    const userId = res.locals.token.id;
    const watched = await MoviesWatchedModel.isMovieWatchedFromIMDB(userId, String(req.query.imdb_code));
    if (watched && !watched.length) {
        MoviesWatchedModel.insertMovieWatched(userId, String(req.query.hash), String(req.query.imdb_code))
    }
    MoviesModel.updateLastView(String(req.query.hash))
    await streamMovie(req, res, dbFile, statFile, currentMovie)
}

export class Movie {

    public engine: any;
    public movieFile: any;
    public isInit: boolean;
    public start: number | null = null;
    public end: number | null = null;
    public transcode: boolean = false;

    constructor(public hash: string, public imdb_code: string) {
        this.hash = hash;
        this.engine = torrentStream(`magnet:?xt=urn:btih:${hash}`, {
            path: `./torrents/`,
            trackers: [
                'udp://open.demonii.com:1337/announce',
                'udp://tracker.openbittorrent.com:80',
                'udp://tracker.coppersurfer.tk:6969',
                'udp://glotorrents.pw:6969/announce',
                'udp://tracker.opentrackr.org:1337/announce',
                'udp://torrent.gresille.org:80/announce',
                'udp://p4p.arenabg.com:1337',
                'udp://tracker.leechers-paradise.org:6969',
            ]
        });
    }

    init() {
        return (new Promise<void>((resolve) => {
            if (!this.isInit && this.engine) {
                this.engine.on('ready', () => {
                    let files = this.engine.files.filter((f: any) => f.name.endsWith(".mp4"));
                    if (!files.length) {
                        files = this.engine.files.filter((f: any) => {
                            for (let i in extensions) {
                                if (f.name.endsWith(extensions[i])) {
                                    this.transcode = true;
                                    return (true)
                                }
                            }
                            return (false);
                        });
                    }
                    this.movieFile = files[0];
                    if (!this.movieFile) {
                        resolve();
                        return;
                    }
                    resolve();
                })

                this.engine.on('download', (pieceIndex: any) => {
                    if (!this.isInit) {
                        insertMovie(this.hash, this.imdb_code, this.movieFile.name.slice(50),
                            this.movieFile.length, this.movieFile.path,
                            this.movieFile.path.split("/")[0], "movie", "downloading")
                        this.isInit = true;
                    }
                    console.log(`\rtotal downloaded ${pieceIndex} : ${(this.engine.swarm.downloaded / 2000000000).toFixed(2)} % // ${(this.engine.swarm.downloaded / 1000000).toFixed(2)} mo`)
                })

                this.engine.on('idle', () => {
                    if (this.engine.downloaded >= this.movieFile.length) {
                        console.log("Movie entirely downloaded")
                        const index = movieDownloading.findIndex((m: Movie) => m.hash === this.hash);
                        if (index) {
                            movieDownloading = movieDownloading.slice(index, index + 1);
                        }
                    }
                })
            }
            else
                resolve();
        }))
    }

    async stream(res: Response, start: number, end: number) {
        if (this.movieFile) {
            if (this.transcode) {
                let input_file = this.movieFile.createReadStream();
                var ffmpeg = spawn('ffmpeg', [
                    '-i', 'pipe:0',
                    '-f', 'mp4',
                    '-c:v', 'libx264',
                    "-c:a", "copy",
                    '-crf', '15',
                    "-preset", "ultrafast",
                    '-movflags', 'frag_keyframe+empty_moov',
                    '-threads', '5',
                    'pipe:1'
                ]);
                input_file.pipe(ffmpeg.stdin);
                ffmpeg.stdout.pipe(res, { end: true });

                ffmpeg.stderr.on('data', function (data) {
                    console.log("converting frames ...")
                    // console.log(data.toString());
                });

                ffmpeg.stderr.on('end', () => {
                    console.log('file has been converted succesfully');
                });

                ffmpeg.stderr.on('exit', () => {
                    console.log('child process exited');
                });

                ffmpeg.stderr.on('close', () => {
                    console.log('...closing time! bye');
                });
            }
            else {
                const stream = this.movieFile.createReadStream({ start, end });
                stream.pipe(res);
            }
        }
    }
}

export async function streamMovie(req: Request, res: Response, dbFile: any, statFile: any, currentMovie: Movie) {

    if (req.headers.range) {
        const ranges = req.headers.range.replace(/bytes=/, "").split('-')
        if (ranges) {
            const start = Number(ranges[0]);
            let end = ranges[1] ? Number(ranges[1]) : null;
            const lenFile = dbFile ? dbFile.size : currentMovie.movieFile.length;
            if (!end) {
                if (statFile && dbFile && statFile.size === dbFile.size) {
                    res.setHeader("Content-Length", `${dbFile.size}`);
                    fs.createReadStream('./torrents/' + dbFile.path).pipe(res)
                }
                else {
                    end = Math.min(start + bytesChunck, Number(lenFile)) - 1;
                    res.setHeader('Content-Type', "video/mp4")
                    if (currentMovie) {
                        if (currentMovie.transcode) {
                            res.status(200)
                        }
                        else {
                            res.setHeader("Accept-Ranges", 'bytes');
                            res.setHeader("Content-Range", `bytes ${start}-${end}/${lenFile}`);
                            res.setHeader("Content-Length", `${end - start + 1}`);
                            res.status(206)
                        }
                        await currentMovie.stream(res, start, end)
                    }
                }
            }
            else if (Number(start) >= Number(end))
                return (res.status(400).json({ message: "Bad ranges" }))
            else {
                res.setHeader("Accept-Ranges", 'bytes');
                res.setHeader("Content-Range", `bytes ${start}-${end}/${lenFile}`);
                res.setHeader("Content-Length", `${end - start + 1}`);
                res.status(206)
                await currentMovie.stream(res, start, end)
            }
        }
    }
}

export default {
    getMovieFromName,
    getMovieFromHashInfo,
    insertMovie,
    deleteMovieFromName,
    deleteMovieFromIMDB,
    streamMovie,
    movieDownloading,
    handleStream,
}