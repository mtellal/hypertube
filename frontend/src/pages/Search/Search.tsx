import { useCallback, useEffect, useRef, useState } from 'react'
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

    const { currentUser } = useCurrentUser();
    const { language } = useLanguage()
    const navigate = useNavigate();

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


    const searchRef: React.MutableRefObject<HTMLDivElement> = useRef();
    const loadingVideosRef = useRef(false);
    const scrollInitRef = useRef(false);

    useEffect(() => {
        if (!scrollInitRef.current && scrollHeightRef.current && searchRef.current) {
            searchRef.current.scrollTop = scrollHeightRef.current;
        }
    }, [scrollHeightRef.current, searchRef.current])


    const handleScroll = useCallback(async (e: any) => {
        scrollHeightRef.current = e.target.scrollTop
        if (!loadingVideosRef.current &&
            e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50) {
            loadingVideosRef.current = true;
            await loadMoreVideos(videoValue);
            loadingVideosRef.current = false;
        }
    }, [videoValue])

    async function searchVideo() {
        loadVideos(videoValue)
    }

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (searchRef.current)
                searchRef.current.removeEventListener('scroll', handleScroll);
        }
    }, [searchRef.current, videoValue])

    return (
        <div ref={searchRef} className='search'>
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