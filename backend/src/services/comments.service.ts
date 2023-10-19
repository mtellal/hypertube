
const CommentsService = require('../models/comments.models');

export async function getComments(imdb_code: string | number) {
    return (await CommentsService.getComments(imdb_code))
}

export async function insertComment(userId: string | number, imbd_code: string | number, text: string | number) {
    return (await CommentsService.insertComment(userId, imbd_code, text));
}

export default {
    getComments,
    insertComment
}