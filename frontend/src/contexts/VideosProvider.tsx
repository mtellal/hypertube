import { MutableRefObject, ReactNode, Ref, RefObject, createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getMovieRequest } from "../requests";
import { Filter } from "../pages/Search/Filter/Filter";
import { Sort } from "../pages/Search/Sort/Sort";

type TVideoContext = {
    loadVideos: (s: string) => void,
    videosIdsRef: MutableRefObject<number[]>,
    videos: any,
    videosDispatch: (opt: any) => void,
    filterIds: number[],
    setFilterIds: (ids: number[]) => void,
    loadMoreVideos: (s: string) => void,
    filterConfigRef: MutableRefObject<Filter>,
    sortConfigRef: MutableRefObject<Sort>,
    scrollHeightRef: MutableRefObject<number>,
    pageRef: MutableRefObject<number>,
    movieCount: number,
    videoValue: string,
    setVideoValue: (s: string) => void,
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
        case ('addVideo'): {
            if (action.video)
                return ([...videos, action.video])
        }
        case ('removeVideos'): {
            return ([]);
        }
        default: return videos;
    }
}

type VideoProviderProps = {
    children: ReactNode
}

export default function VideoProvider({ children }: VideoProviderProps) {

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
            .catch(() => { })

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
            .catch(() => { })

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