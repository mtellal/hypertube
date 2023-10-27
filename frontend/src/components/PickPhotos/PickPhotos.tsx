import React from "react";

import './PickPhotos.css'
import { Icon } from "../Icons/Icon";

import addIcon from '../../assets/Add_Plus.svg'
import checkIconBlack from '../../assets/Check Black.svg'

import { RoundIconBorder } from "../Icons/RoundIconBorder";

export type TPhoto = {
    url: string,
    file: File
}

type TPhotoLabel = {
    id: number,
    photo: TPhoto | string,
    setPhoto: (p: TPhoto | string) => void
    pp?: boolean,
}

function PhotoLabel(props: TPhotoLabel) {

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            props.setPhoto({
                file: e.target.files[0],
                url: window.URL.createObjectURL(e.target.files[0])
            });
        }
    }

    return (
        <div
            className="pickphotos-photo"
            style={props.pp ? { borderColor: '#FFB2D7' } : {}}>
            {
                props.photo &&
                <img
                    src={typeof props.photo === "string" ? props.photo : (props.photo as TPhoto).url}
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
            }
            <label htmlFor={props.id.toString()} style={{ position: 'absolute', }}>
                <Icon icon={addIcon} style={{ width: '40px', height: '40px' }} />
            </label>
            <input
                id={props.id.toString()}
                type="file"
                style={{ visibility: 'hidden', position: 'absolute', left: '50%', top: '50%' }}
                onChange={onChange}
            />
        </div>
    )
}


type TPickPhotos = {
    title: string,
    photo: TPhoto | string,
    setPhoto: (p: TPhoto | string) => void
    style?: {},
    editing?: boolean,
    editClick?: () => void
}

export default function PickPhotos(props: TPickPhotos) {

    return (
        <div className="pickphotos" style={props.style}>
            <div className="pickphotos-c1">
                <p className="title-input">{props.title}</p>
                <div className="pickphotos-c2" >
                    <PhotoLabel
                        id={0}
                        pp={true}
                        photo={props.photo}
                        setPhoto={props.setPhoto}
                    />
                    {
                        props.editing &&
                        <div className="pickphotos-editicon" >
                            <RoundIconBorder
                                icon={checkIconBlack}
                                onClick={props.editClick}
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>

                    }
                </div>
            </div>
        </div>
    )
}