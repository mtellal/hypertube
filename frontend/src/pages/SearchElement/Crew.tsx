import iconMovie from '../../assets/movie-clapper-open-svgrepo-com.svg'

export default function Crew({ video }: any) {
    return (
        <div className='searchelm-cast'>
            <h1>Crew</h1>
            {
                video && video.crew && video.crew.length &&
                <div className='searchelm-cast2'>
                    <div className='searchelm-cast-list'>
                        {
                            video.crew.slice(0, 20).map((p: any) =>
                                <div key={p.job + p.id} className='person-card'>
                                    <img className='person-img' src={p.profile_path ? `https://image.tmdb.org/t/p/w500/${p.profile_path}` : iconMovie} />
                                    <p className='person-card-name font-16' >{p.job}</p>
                                    <p className='person-card-name font-14' >{p.name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    )
}
