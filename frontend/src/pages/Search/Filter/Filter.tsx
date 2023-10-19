import { useCallback, useEffect, useRef, useState } from "react";
import PickMenuSmall from "../../../components/Picker/PickMenuSmall/PickMenuSmall";
import InputRangeText from "../../../components/Inputs/InputRangeText/InputRangeText";

import './Filter.css'

import { useVideoContext } from "../../../contexts/VideosProvider";
import InputSmall from "../../../components/Inputs/InputSmall/InputSmall";
import { ButtonBorder } from "../../../components/Buttons/ButtonBorder";
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";

export default function MenuFilter(props: any) {

    const { videos, filterConfigRef, setFilterIds } = useVideoContext();

    const menuFilterRef = useRef();

    useOutsideComponent(menuFilterRef, props.valid)

    const [filters, setFilters] = useState({
        name: "",
        genre: "",
        gradeRange: { value1: '', value2: '' },
        productionYearRange: { value1: '', value2: '' }
    });

    const filterInitRef = useRef(false);

    useEffect(() => {
        if (filterConfigRef.current && !filterInitRef.current) {
            setFilters(filterConfigRef.current);
            filterInitRef.current = true;
        }
    }, [filterConfigRef.current, filterInitRef.current])

    function setName(s: string) {
        setFilters((f: any) => {
            const up = { ...f, name: s };
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setGenre(s: string) {
        setFilters((f: any) => {
            const up = { ...f, genre: s }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setGradeRange1(s: string) {
        setFilters((f: any) => {
            const up = { ...f, gradeRange: { ...f.gradeRange, value1: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setGradeRange2(s: string) {
        setFilters((f: any) => {
            const up = { ...f, gradeRange: { ...f.gradeRange, value2: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setProductionYearRange1(s: string) {
        setFilters((f: any) => {
            const up = { ...f, productionYearRange: { ...f.productionYearRange, value1: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setProductionYearRange2(s: string) {
        setFilters((f: any) => {
            const up = { ...f, productionYearRange: { ...f.productionYearRange, value2: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }


    useEffect(() => {
        let _filterVideosIds = videos.map((u: any) => {
            if (filters.name && filters.name !== "none") {

                let index1 = -1;
                try { index1 = u.title.toLowerCase().search(filters.name.toLowerCase()) }
                catch (e) { }

                if (index1 === -1)
                    return (u.id)
            }

            if (filters.genre && filters.genre !== "none") {

                if (!u.genres.includes(filters.genre))
                    return (u.id)
            }

            if (filters.gradeRange.value1 && filters.gradeRange.value2) {

                let v1 = parseFloat(filters.gradeRange.value1);
                let v2 = parseFloat(filters.gradeRange.value2);

                if (v1 > v2) {
                    v1 = v2;
                    v2 = parseFloat(filters.gradeRange.value1);
                }
                if ((parseFloat(u.rating) < v1 || parseFloat(u.rating) > v2))
                    return (u.id)
            }
            if (filters.productionYearRange.value1 && filters.productionYearRange.value2) {
                let v1 = parseInt(filters.productionYearRange.value1);
                let v2 = parseInt(filters.productionYearRange.value2);

                if (v1 > v2) {
                    v1 = v2;
                    v2 = parseInt(filters.productionYearRange.value1);
                }
                if ((parseInt(u.year) < v1 || parseInt(u.year) > v2))
                    return (u.id)
            }
            return (null)
        })
        _filterVideosIds = _filterVideosIds.filter((v: any) => v);
        setFilterIds(_filterVideosIds)
    }, [filters.name, filters.genre, filters.gradeRange, filters.productionYearRange])

    return (
        <div className='menusort' ref={menuFilterRef} >
            <h1 className="menusort-title">{props.title}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '250px' }}>

                <InputSmall
                    label="Title"
                    value={filters.name}
                    setValue={setName}
                    placeholder="Spider man"
                    maxLength={100}
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
                    value={filters && filters.genre}
                    setValue={setGenre}
                />
                <InputRangeText
                    label="Grade range"
                    value1={filters.gradeRange.value1}
                    value2={filters.gradeRange.value2}
                    setValue1={setGradeRange1}
                    setValue2={setGradeRange2}
                    placeholder1="0"
                    placeholder2="10"
                    maxLength={3}
                />
                <InputRangeText
                    label="Production year range"
                    value1={filters.productionYearRange.value1}
                    value2={filters.productionYearRange.value2}
                    setValue1={setProductionYearRange1}
                    setValue2={setProductionYearRange2}
                    placeholder1="1980"
                    placeholder2="2023"
                    maxLength={4}
                />
                <ButtonBorder title="Valid" onClick={props.valid} />
            </div>
        </div>
    )
}