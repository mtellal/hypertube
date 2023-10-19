
import './MovieCart.css'

import icon from '../../assets/movie-clapper-open-svgrepo-com.svg'

export default function MovieCart({ data, onClick, watched }: any) {

    return (
        <div className='moviecart' onClick={onClick} style={watched ? {backgroundColor: 'var(--primary4'}: {}}>
            <img
                src={data.medium_cover_image ?? icon}
                className='moviecart-img'
            />
            <div className='moviecart-infos'>
                <div className='moviecart-title-c'>
                    <p className='moviecart-title'>{data && data.title}</p>
                    <p>{data && data.year}</p>
                </div>
                <p className='moviecart-overview'>{data && data.summary}</p>
                <div className='moviecart-stats'>
                    <p>{data && data.rating}</p>
                    {
                        data && data.genres && data.genres.length &&
                        data.genres.map((g: string) => <p key={g} className='moviecart-genres font-14'>{g}</p>)
                    }

                </div>
            </div>
        </div>
    )
}