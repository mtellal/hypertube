import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getMovieRequest } from "../requests";

type TVideoContext = {
    loadVideos: any,
    videosIdsRef: any,
    videos: any,
    videosDispatch: any,
    filterIds: any,
    setFilterIds: any,
    loadMoreVideos: any,
    filterConfigRef: any,
    sortConfigRef: any,
    scrollHeightRef: any,
    pageRef: any,
    movieCount: number,
    videoValue: any, 
    setVideoValue: any,
    videosLoaded: boolean,
}

export const VideoContext: React.Context<TVideoContext> = createContext(null);

export function useVideoContext() {
    return (useContext(VideoContext))
}

export function videoReducer(videos: any, action: any) {
    switch (action.type) {
        case ('videos'): {
            if (action.videos && action.videos.length)
                return (action.videos)
        }
        case ('addVideos'): {
            if (action.videos && action.videos)
                return ([...videos, ...action.videos])
        }
        case ('resetOriginal'): {
            if (action.videos && action.videos.length) {
                return (
                    action.videos.map((id: number) => videos.find((u: any) => u.id === id))
                )
            }
        }
        case ('addVideo'): {
            if (action.video)
                return ([...videos, action.video])
        }
        case ('removeVideos'): {
            return ([]);
        }
        case ('sortYounger'): {
            return (
                [...videos.sort((u1: any, u2: any) => parseInt(u1.age) - parseInt(u2.age))]
            )
        }
        case ('sortOlder'): {
            return (
                [...videos.sort((u1: any, u2: any) => parseInt(u2.age) - parseInt(u1.age))]
            )
        }
        default: return videos;
    }
}


export default function VideoProvider({ children }: any) {

    const [videos, videosDispatch] = useReducer(videoReducer, []);
    const [filterIds, setFilterIds] = useState([]);
    const [movieCount, setMovieCount] = useState(0);
    const [videoValue, setVideoValue] = useState("");
    const [videosLoaded, setVideosLoaded] = useState(false);

    const filterConfigRef = useRef();
    const sortConfigRef = useRef();

    const videosIdsRef = useRef([]);
    const videosIndexRef = useRef(20);
    const advancedOptionsRef = useRef(false);

    const scrollHeightRef = useRef(0);

    const pageRef = useRef(1);

    async function loadMoreVideos(movie: string = "") {
        pageRef.current++;
        let data = await getMovieRequest({ movie, page: pageRef.current })
            .then(res => res && res.status === 200 && res.data && res.data.data ? res.data.data.data : null)
            .catch(() => {})

        if (data) {
            if (data.movies) {
                videosIdsRef.current = [...videosIdsRef.current, ...data.movies.map((m: any) => m.id)];
                videosDispatch({ type: 'addVideos', videos: data.movies })
            }
            setMovieCount(data.movie_count);
        }
        videosIndexRef.current += 20;
    }


    async function loadVideos(movie: string = "") {
        advancedOptionsRef.current = null;
        videosIndexRef.current = 20;
        pageRef.current = 1;

        videosDispatch({ type: 'removeVideos' });


        let data = await getMovieRequest({ movie, page: pageRef.current })
            .then(res => res && res.status === 200 && res.data && res.data.data ? res.data.data.data : null)
            .catch(() => {})

        if (data) {
            if (data.movies) {
                videosIdsRef.current = data.movies.map((m: any) => m.id);
                videosDispatch({ type: 'videos', videos: data.movies })
            }
            setMovieCount(data.movie_count);
        }
        setVideosLoaded(true);
    }


    useEffect(() => {
        loadVideos();
    }, [])

    return (
        <VideoContext.Provider
            value={{
                loadVideos,
                videosIdsRef,
                videos,
                videosDispatch,
                filterIds,
                setFilterIds,
                loadMoreVideos,
                filterConfigRef,
                sortConfigRef,
                scrollHeightRef,
                pageRef,
                movieCount,
                videoValue, 
                setVideoValue,
                videosLoaded
            }}
        >
            {children}
        </VideoContext.Provider>
    )
}