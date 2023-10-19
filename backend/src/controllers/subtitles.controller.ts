import { Request, Response } from "express";
import SubtitlesService from "../services/subtitles.service";

function isLanguageInSubtitles(dbSubtitles: any[], searchedLanguage: string) {
    if (dbSubtitles && dbSubtitles.length) {
        for (let i in dbSubtitles) {
            if (dbSubtitles[i].langage.toLowerCase() === searchedLanguage)
                return (true)
        }
    }
    return (false);
}


export async function getSubtitlesList(req: Request, res: Response) {
    if (!req.query.imdb_code || !req.query.title)
        return (res.status(400).json({ message: "Query params required" }))
    if (String(req.query.imdb_code).length > 20)
        return (res.status(400).json({ message: "Query params imdb_code invalid" }))
    try {
        let subtitles = await SubtitlesService.getSubtitlesFromIMDB(String(req.query.imdb_code));
        if (!req.query.preferredLanguage)
            req.query.preferredLanguage = "english"
        if (!isLanguageInSubtitles(subtitles, String(req.query.preferredLanguage))) {
            const lng = [];
            if (!subtitles || !subtitles.length)
                lng.push("english");
            if (req.query.preferredLanguage !== "english")
                lng.push(String(req.query.preferredLanguage))
            await SubtitlesService.downloadMovieSubtitle(String(req.query.title), String(req.query.imdb_code), lng);
            subtitles = await SubtitlesService.getSubtitlesFromIMDB(String(req.query.imdb_code));
        }
        res.status(200).json({ data: subtitles, message: "Subtitles successfully sent" })
    }
    catch (e) {
        // console.log(e)
        res.status(404).json({ message: "Subtitles not found" });
    }
    return (res)
}

export async function getSubtitles(req: Request, res: Response) {
    if (!req.params.id)
        return (res.status(400).json({ message: "id required" }))
    try {
        const path = await SubtitlesService.getSubtitlePathFromId(req.params.id);
        if (!path)
            return (res.status(404).json({ message: "Subtitles not found" }))
        res.sendFile(process.cwd() + "/torrents/" + path.split("/")[2], (err: any) => {
            if (err) {
                // console.log(err)
                console.log("Error: send subtitle file failed ")
                res.status(404).json({ message: "Subtitle file not found" });
            }
        })
    }
    catch (e) {
        // console.log(e)
        res.status(404).json({ message: "Subtitle file not found" });
    }
    return (res);
}

export default {
    getSubtitlesList,
    getSubtitles
};