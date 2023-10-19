import SubtitlesModel from '../models/subtitles.model'
import _fs from 'fs'
import { Readable } from 'stream'


const srt2vtt = require('srt-to-vtt')
const subscene = require('node-subscene-api')

const getSubtitlesFromIMDB = async (imdb_code: string) => {
    return (await SubtitlesModel.getSubtitlesFromIMDB(imdb_code))
}

const getSubtitlePathFromId = async (id: string | number) => {
    const res = await SubtitlesModel.getSubtitleFromId(id);
    if (res[0])
        return (res[0].path)
    return (null)
}


async function downloadMovieSubtitle(movieTitle: string, imdb_code: string, languages: string[]) {
    let data: any = [];

    await subscene.search(movieTitle)
        .then(async (res: any) => {
            if (!res || !res.length)
                return;
            let selectedSubtitlesPath = res[0].path;
            for (let i in res) {
                if (res[i].title === movieTitle) {
                    selectedSubtitlesPath = res[i].path
                }
            }
            await subscene.getSubtitles(selectedSubtitlesPath)
                .then(async (subtitles: any) => {
                    const paths = [];
                    for (const [key, value] of Object.entries(subtitles)) {
                        if (languages.includes(key)) {
                            paths.push((value as any)[0]);
                        }
                    }
                    paths.map(async (o: any) => {
                        await subscene.download(o.path, { zip: false })
                            .then(async (file: any) => {
                                const fileName = "./torrents/" + o.lang + "_" + file[0].filename.slice(0, 50);
                                Readable.from(file[0].file)
                                    .on("end", () => {
                                        SubtitlesModel.insertSubtitle(imdb_code, o.lang, fileName)
                                    })
                                    .pipe(srt2vtt())
                                    .pipe(_fs.createWriteStream(fileName))
                            })
                            .catch((err: any) => {
                                // console.log(err)
                                console.log("Error: subscene.download request failed")
                            })
                    })
                })
                .catch((err: any) => {
                    // console.log(err)
                    console.log("Error: subscene.getSubtitles request failed")
                })
        })
        .catch((err: any) => {
            // console.log(err)
            console.log("Error: subscene.search request failed")
        })

    return (data)
}

export default {
    getSubtitlesFromIMDB,
    getSubtitlePathFromId,
    downloadMovieSubtitle
}