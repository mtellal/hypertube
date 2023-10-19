
import { useNavigate, useParams } from 'react-router'
import './SearchElement.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useVideoContext } from '../../contexts/VideosProvider';
import { getMovieDetailsRequest, getMovieRequest } from '../../requests';

import Comments from './Comments/Comments';
import MoviePresentation from './MoviePresentation';
import Cast from './Cast';
import Crew from './Crew';

import playButtonIcon from '../../assets/play-button.svg'
import { getMovieSubtitlesRequest } from '../../requests';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export function Informations({ video }: any) {
    return (
        <div className='searchelm-infos'>
            <h1>Informations</h1>
            <p>Budget: {video && video.budget ? `${video.budget} (dollars)` : "Unknown"}</p>
            <p>Revenue: {video && video.revenue ? `${video.revenue} (dollars)` : "Unknown"}</p>
            <p>Runtime: {video && video.runtime ? `${video.runtime} minutes` : "Unknown"}</p>
            <p>Production countries: {video && video.production_countries ? video.production_countries.map((o: any) => o.name) : "Unknown"}</p>
        </div>
    )
}

export default function SearchElement() {

    const { width } = useWindowDimensions();

    const navigate = useNavigate();
    const { videos, videosLoaded } = useVideoContext();
    const { imdb_code } = useParams();
    const [video, setVideo]: any = useState();

    const [torrentHashPicked, setTorrentHashPicked] = useState()
    const [subtitles, setSubtitles]: any = useState()
    const videoRef: any = useRef();

    async function fetchMovieDetails(video: any) {
        getMovieDetailsRequest(video.imdb_code)
            .then(res => { if (res && res.status === 200 && res.data) setVideo({ ...res.data.data, ...video }) })
            .catch(() => {})
    }

    async function getMovie(imdb_code: string) {
        let data: any = null;
        await getMovieRequest({ imdb_code })
            .then((res: any) => {
                if (res && res.data && res.data.data &&
                    res.data.data.data && res.data.data.data.movie)
                    data = res.data.data.data.movie
            })
            .catch(() => navigate("/search"))
        return (data)
    }

    async function loadVideoDatas(videos: any[], imdb_code: string) {
        let _video = videos.find((v: any) => v.imdb_code === imdb_code);
        if (!_video) {
            _video = await getMovie(imdb_code);
        }
        if (_video)
            fetchMovieDetails(_video)
    }

    useEffect(() => {
        if (imdb_code && videos && videosLoaded) {
            loadVideoDatas(videos, imdb_code)
        }
    }, [imdb_code, videos, videosLoaded])


    useEffect(() => {
        if (video) {
            getMovieSubtitlesRequest(video.title_long || video.title, video.imdb_code, localStorage.getItem("prefLanguage") || "")
                .then((res: any) => {
                    if (res.data && res.data.data) {
                        setSubtitles(res.data.data)
                    }
                })
                .catch(() => {})
        }
    }, [video])

    const handleTorrentLink = useCallback((t: any) => {
        if (videoRef.current && video) {
            setTorrentHashPicked(t.hash)
            videoRef.current.src = `http://${process.env.REACT_APP_BACK_DOMAIN}:3000/movie/stream?imdb_code=${video.imdb_code}&hash=${t.hash}&url=${t.url}`
        }
    }, [videoRef.current, video])


    return (
        <div className="searchelm">
            <MoviePresentation video={video} />
            <div className='video-c'>
                {
                    video &&
                    <video ref={videoRef} controls crossOrigin='use-credentials' width={Math.min(800, width * 0.9)} muted={true} >
                        <source src={torrentHashPicked && video ? `http://${process.env.REACT_APP_BACK_DOMAIN}:3000/user/stream?imdb_code=${video.imdb_code}&hash=${torrentHashPicked}` : ''} type='video/mp4'></source>
                        <source src={torrentHashPicked && video ? `http://${process.env.REACT_APP_BACK_DOMAIN}:3000/user/stream?imdb_code=${video.imdb_code}&hash=${torrentHashPicked}` : ''} type='video/webm'></source>
                        {
                            subtitles && subtitles.length > 0 &&
                            subtitles.map((s: any) =>
                                <track
                                    key={s.id}
                                    kind='subtitles'
                                    default
                                    srcLang={s.langage}
                                    src={`http://${process.env.REACT_APP_BACK_DOMAIN}:3000/subtitles/${s.id}`}
                                />
                            )
                        }
                    </video>
                }
                {
                    video && video.torrents && video.torrents.length > 0 &&
                    <div className='torrent-c'>
                        {
                            video.torrents.map((t: any) =>
                                <div
                                    key={t.hash}
                                    className='torrent-element'
                                    onClick={() => handleTorrentLink(t)}
                                    style={t.hash === torrentHashPicked ? { backgroundColor: 'var(--primary4)' } : {}}
                                >
                                    <img className='torrent-playbutton' src={playButtonIcon} />
                                    <p>{t.quality}</p>
                                    <p>{t.type}</p>
                                    <p>{t.size}</p>
                                    <p>seeds: {t.seeds}</p>
                                    <p>peers: {t.peers}</p>
                                </div>
                            )
                        }
                    </div>

                }
                <div className='searchelm-desc'>
                    <h1>Sumarize</h1>
                    <p>{video && video.description_full}</p>
                </div>
            <Informations video={video} />
            <Cast video={video} />
            <Crew video={video} />
            <Comments video={video} />
            </div>
        </div >
    )
}