import './MoviePresentation.css'

export default function MoviePresentation({ video }: any) {
    return (
        <div className='searchelm-c1'>
            <div className='' style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                    <h1 className='searchelm-title'>{video && video.title}</h1>
                    <h1 className='searchelm-year'>{video && video.year}</h1>
                    <div className='searchelm-rating'>
                        <p className='searchelm-rating-rate'>{video && video.rating}</p>
                        <p className='font-12' style={{ opacity: '70%' }}>IMDb rating</p>
                    </div>
                </div>
                <div className='moviep-poster-c' style={{ display: 'flex', gap: '20px', margin: '5px' }}>
                    <img
                        className='searchelm-img'
                        src={video && video.medium_cover_image}
                    />
                    <iframe
                        className="video-iframe"
                        src={video && `https://www.youtube.com/embed/${video.yt_trailer_code}?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3`}
                    >
                    </iframe>
                </div>
                <div className='moviecart-stats'>
                    {
                        video && video.genres && video.genres.length &&
                        video.genres.map((g: string) => <p key={g} className='moviecart-genres font-14'>{g}</p>)
                    }
                </div>
            </div>
        </div>
    )
}