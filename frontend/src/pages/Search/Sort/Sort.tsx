import { useCallback, useEffect, useRef, useState } from "react";
import PickMenuSmall from "../../../components/Picker/PickMenuSmall/PickMenuSmall";
import { useVideoContext } from "../../../contexts/VideosProvider";

import './Sort.css'
import { ButtonBorder } from "../../../components/Buttons/ButtonBorder";
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";
import InputSmall from "../../../components/Inputs/InputSmall/InputSmall";

export default function MenuSort(props: any) {

    const { sortConfigRef, videos, videosDispatch } = useVideoContext();

    const [sorts, setSorts] = useState({
        name: '',
        genre: '',
        grade: 'none',
        productionYear: 'none'
    });

    const menuSortRef = useRef();
    useOutsideComponent(menuSortRef, props.valid);
    const sortConfigInitRef = useRef(false);

    useEffect(() => {
        if (sortConfigRef.current && !sortConfigInitRef.current) {
            setSorts(sortConfigRef.current);
            sortConfigInitRef.current = true;
        }
    }, [sortConfigInitRef.current, sortConfigRef.current])

    function setName(s: string) {
        setSorts((f: any) => {
            const up = { ...f, name: s }
            sortConfigRef.current = up;
            return (up)
        })
    }

    function setGenre(s: string) {
        setSorts((f: any) => {
            const up = { ...f, genre: s }
            sortConfigRef.current = up;
            return (up)
        })
    }

    function setGrade(s: string) {
        setSorts((f: any) => {
            const up = { ...f, grade: s }
            sortConfigRef.current = up;
            return (up)
        })
    }

    function setProductionYear(s: string) {
        setSorts((f: any) => {
            const up = { ...f, productionYear: s }
            sortConfigRef.current = up;
            return (up)
        })
    }


    useEffect(() => {
        let weights = 0;
        for (let values of Object.values(sorts)) {
            if (values !== "none")
                weights++;
        }

        let users = [...videos];
        users = users.sort((u1: any, u2: any) => {

            let scoreName = 0;
            let scoreGenre = 0;
            let scoreGrade = 0;
            let scoreProductionYear = 0;

            if (sorts.name && sorts.name !== "none") {

                let index1 = -1;
                let index2 = -1;
                try { index1 = u1.title.toLowerCase().search(sorts.name.toLowerCase()) }
                catch (e) { }
                try { index2 = u2.title.toLowerCase().search(sorts.name.toLowerCase()) }
                catch (e) { }

                let scoreNameU1 = (1 / weights) * (index1 === -1 ? 0 : 1 / sorts.name.length);
                let scoreNameU2 = (1 / weights) * (index2 === -1 ? 0 : 1 / sorts.name.length);

                scoreName = scoreNameU2 - scoreNameU1;
            }

            if (sorts.genre && sorts.genre !== "none") {

                let scoreGenreU1 = (1 / weights) * (u1.genres.includes(sorts.genre) ? 1 : 0);
                let scoreGenreU2 = (1 / weights) * (u2.genres.includes(sorts.genre) ? 1 : 0);

                scoreGenre = scoreGenreU2 - scoreGenreU1;
            }

            if (sorts.grade !== "none") {
                const maxFameRating = Math.max(...videos.map((u: any) => u.rating));
                let scoreGradeU1 = (1 / weights) * (parseFloat(u1.rating) / maxFameRating);
                let scoreGradeU2 = (1 / weights) * (parseFloat(u2.rating) / maxFameRating);

                if (sorts.grade === "higher") {
                    scoreGrade = scoreGradeU2 - scoreGradeU1;
                }
                else
                    scoreGrade = scoreGradeU1 - scoreGradeU2;
            }

            if (sorts.productionYear !== "none") {

                const maxCommonTags = Math.max(...videos.map((u: any) => parseInt(u.year)));
                let scoreCommonTagsU1 = (1 / weights) * (parseFloat(u1.year) / maxCommonTags);
                let scoreCommonTagsU2 = (1 / weights) * (parseFloat(u2.year) / maxCommonTags);


                if (sorts.productionYear === "latest") {
                    scoreProductionYear = scoreCommonTagsU2 - scoreCommonTagsU1;
                }
                else
                    scoreProductionYear = scoreCommonTagsU1 - scoreCommonTagsU2;
            }
            return (scoreName + scoreGenre + scoreGrade + scoreProductionYear);
        })
        videosDispatch({ type: 'videos', videos: users })

    }, [sorts])


    return (
        <div className='menusort' ref={menuSortRef} >
            <h1 className="menusort-title">{props.title}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '250px' }}>
                <InputSmall
                    label="Title"
                    value={sorts && sorts.name}
                    setValue={setName}
                    placeholder="Spider"
                />
                <PickMenuSmall
                    title="Genre"
                    options={[
                        "Action",
                        "Comedy",
                        "Drama",
                        "Fantasy",
                        "Horror",
                        "Mystery",
                        "Romance",
                        "Thriller",
                        "Sci-Fi"
                    ]}
                    value={sorts && sorts.genre}
                    setValue={setGenre}
                />
                <PickMenuSmall
                    title="Grade"
                    options={["higher", "lower"]}
                    value={sorts && sorts.grade}
                    setValue={setGrade}
                />
                <PickMenuSmall
                    title="Producation year"
                    options={["latest", "oldest"]}
                    value={sorts && sorts.productionYear}
                    setValue={setProductionYear}
                    displayUp={true}
                />
                <ButtonBorder title="Valid" onClick={props.valid} />
            </div>
        </div>
    )
}