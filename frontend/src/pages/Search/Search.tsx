import { SyntheticEvent, useCallback, useEffect, useRef } from 'react'
import SearchBar from '../../components/Inputs/SearchBar/SearchBar'
import './Search.css'
import { Button } from '../../components/Buttons/Button';
import MovieCart from '../../components/MovieCart/MovieCart';
import { useVideoContext } from '../../contexts/VideosProvider';
import { ModalPage, useModalPage } from '../../components/Modal/ModalPage';
import MenuSort from './Sort/Sort';
import MenuFilter from './Filter/Filter';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../contexts/language';
import { useCurrentUser } from '../../contexts/UserContext';

export type SearchOptionsProps = {
    title: string, 
    valid: () => void
}

function SearchOptions() {

    const { language } = useLanguage();
    const { modalRef, setShowModal } = useModalPage()

    function clickSorts() {
        modalRef.current = <MenuSort title={language && language.search.sort} valid={() => setShowModal((p: boolean) => !p)} />
        setShowModal((p: boolean) => !p)
    }

    function clickFilters() {
        modalRef.current = <MenuFilter title={language && language.search.filter} valid={() => setShowModal((p: boolean) => !p)} />
        setShowModal((p: boolean) => !p)
    }

    return (
        <div className='search-options'>
            <p className='' onClick={clickFilters}>{language && language.search.filter}</p>
            <p className='' onClick={clickSorts}>{language && language.search.sort}</p>
        </div>
    )
}

export default function Search() {

    const navigate = useNavigate();
    const { language } = useLanguage()
    const { currentUser } = useCurrentUser();

    const {
        loadVideos,
        videos,
        loadMoreVideos,
        scrollHeightRef,
        movieCount,
        filterIds,
        videoValue,
        setVideoValue
    } = useVideoContext();

    const scrollInitRef = useRef(false);
    const loadingVideosRef = useRef(false);
    const searchRef: React.MutableRefObject<HTMLDivElement> = useRef();

    useEffect(() => {
        if (!scrollInitRef.current && scrollHeightRef.current && searchRef.current) {
            searchRef.current.scrollTop = scrollHeightRef.current;
        }
    }, [scrollHeightRef.current, searchRef.current])


    const handleScroll = useCallback(async (e: SyntheticEvent) => {
        scrollHeightRef.current = e.currentTarget.scrollTop
        if (!loadingVideosRef.current &&
            e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight < 50) {
            loadingVideosRef.current = true;
            await loadMoreVideos(videoValue);
            loadingVideosRef.current = false;
        }
    }, [videoValue])

    async function searchVideo() {
        loadVideos(videoValue)
    }

    return (
        <div ref={searchRef} onScroll={handleScroll} className='search'>
            <ModalPage>
                <div className='search-inputs'>
                    <div>
                        <span className='font-14'>{movieCount}</span>
                        <p className='font-12 opacity60'>{language && language.search.resultsFound}</p>
                    </div>
                    <SearchBar
                        value={videoValue}
                        setValue={setVideoValue}
                        maxLength={50}
                        onSubmit={searchVideo}
                        placeholder='Spider man'
                    />
                    <Button
                        title={language && language.Continue}
                        onClick={searchVideo}
                    />
                    <SearchOptions />
                </div>
                <div className='search-list'>
                    <div className='search-list-c'>
                        {
                            videos && videos.length > 0 &&
                            videos
                                .filter((u: any) => !filterIds.includes(u.id))
                                .map((e: any) =>
                                    <MovieCart
                                        key={e.id}
                                        data={e}
                                        watched={currentUser && currentUser.moviesWatched.length > 0 && currentUser.moviesWatched.includes(e.imdb_code)}
                                        onClick={() => navigate(`/search/${e.imdb_code}`)}
                                    />
                                )
                        }
                    </div>
                </div>
            </ModalPage>
        </div>
    )
}