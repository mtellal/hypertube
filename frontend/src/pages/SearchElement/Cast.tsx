
import iconMovie from '../../assets/movie-clapper-open-svgrepo-com.svg'

export default function Cast({ video }: any) {
    return (
        <div className='searchelm-cast'>
            <h1>Cast</h1>
            {
                video && video.cast && video.cast.length &&
                <div className='searchelm-cast2'>
                    <div className='searchelm-cast-list'>
                        {
                            video.cast.slice(0, 20).map((p: any) =>
                                <div key={"cast" + p.id} className='person-card'>
                                    <img className='person-img' src={p.profile_path ? `https://image.tmdb.org/t/p/w500/${p.profile_path}` : iconMovie} />
                                    <p className='person-card-name font-16' >{p.character}</p>
                                    <p className='person-card-name font-14' >{p.original_name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    )
}
