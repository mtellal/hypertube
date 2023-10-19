import SubtitlesController from "./controllers/subtitles.controller";
import UserController from "./controllers/user.controller";
import MovieController from './controllers/movies.controller';
import CommentsController from './controllers/comments.controller'
import OauthController from './controllers/oauth.controller'
import UserMiddleware from './middlewares/userMiddleware'

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.BACK_PORT;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

//////////////////////        O A U T H       ////////////////////// 
app.get("/oauth", OauthController.oauth)
app.get("/oauth/redirect", OauthController.oauthRedirect)

//////////////////////        U S E R       ////////////////////// 
app.use("/user", UserMiddleware.CleanBodyFields)

app.get("/user/all", UserController.getAll);
app.get("/user", UserMiddleware.JWTAuthentification, UserController.getUserInfos)
app.get("/user/:id", UserMiddleware.JWTAuthentification, UserController.getUserInfos)
app.get("/user/photo/:id", UserMiddleware.JWTAuthentification, UserController.getProfilePicture);

app.post("/user/signup", UserController.signup)
app.post("/user/signin", UserController.signin)
app.post("/user/update", UserMiddleware.JWTAuthentification, UserController.updateUser)
app.post("/user/resetPassword", UserMiddleware.JWTAuthentification, UserController.resetPassword)
app.post("/user/updatePassword", UserMiddleware.JWTAuthentification, UserController.updatePassword)
app.post("/user/photos", UserMiddleware.JWTAuthentification, UserController.uploadProfilePicture)


//////////////////////        M O V I E S        ////////////////////// 
app.get("/movie", MovieController.getMovies)
app.get("/movie/stream", UserMiddleware.JWTAuthentification, MovieController.stream)
app.get("/movie/:imdb_id", MovieController.getMovieByIMDB)


//////////////////////        S U B T I T L E S        //////////////////////
app.get("/subtitles/list", SubtitlesController.getSubtitlesList)
app.get("/subtitles/:id", SubtitlesController.getSubtitles)

//////////////////////        C O M M E N T S       ////////////////////// 
app.get("/comments/:imdb", CommentsController.getCommentFromIMDB)
app.post("/comments/:imdb", UserMiddleware.JWTAuthentification, CommentsController.postCommentFromIMDB)

app.get('/', (req: any, res: any) => {
    res.send("Response: \"Server started and listening ...\"")
})

app.listen(port);
