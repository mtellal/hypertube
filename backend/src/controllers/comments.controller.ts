import { Request, Response } from "express";
import CommentsService from "~/services/comments.service";

export async function getCommentFromIMDB(req: Request, res: Response) {
    if (!req.params.imdb)
        return (res.status(400).json({ message: "imdb required" }))
    try {
        const _comments = await CommentsService.getComments(req.params.imdb);
        return (res.status(200).json({ data: _comments ?? [], message: "Comment successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Comments not found" }))
    }
}

export async function postCommentFromIMDB(req: Request, res: Response) {
    if (!req.params.imdb)
        return (res.status(400).json({ message: "imdb required" }));
    if (!req.body || !req.body.text)
        return (res.status(400).json({ message: "text required" }))
    try {
        const userId = res.locals.token.id;
        await CommentsService.insertComment(userId, req.params.imdb, req.body.text);
        res.status(200).json({ message: "Comment successfully added" })
    }
    catch (e) {
        // console.log(e)
        res.status(400).json({ message: "Query invalid" })
    }
    return (res)
}

export default {
    getCommentFromIMDB,
    postCommentFromIMDB
}