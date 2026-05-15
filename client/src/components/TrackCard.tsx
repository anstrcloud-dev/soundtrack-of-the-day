import { useState, useRef, useEffect } from "react"
import CardReveal from './CardReveal'


type TrackCardProps = {
    title: string
    artist: string
    cover: string
    preview: string
    reading: string
    cardArt: string
    onFinishSplash?: () => void //card

}



//Accept props: title, artist, cover, preview — all strings
//Return some JSX displaying them — for now just text and an image, don't worry about the audio player yet
const TrackCard = ({ title, artist, cover, preview, reading, cardArt, onFinishSplash }: TrackCardProps) => {
    const [isPlaying, setIsPlaying] = useState(false) // start as false (not playing)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(30)

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play()
        }
        setIsPlaying(!isPlaying)
    }


    //animation
    const [revealed, setRevealed] = useState(false)
    useEffect(() => {
        setTimeout(() => setRevealed(true), 300)
    }, [])


    return (
        <CardReveal onFinishSplash={onFinishSplash}>
            <div>
                <div className={`transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-sm border border-white/20">
                          <img
                            src={cover}
                            //src={cardArt}
                            
                            alt={title}
                            className="w-full rounded-md mb-4"   /> 
                      {/*  <img
                            src={cardArt}
                            alt={title}
                            className="w-full rounded-md mb-4"
                            onError={(e) => {
                                console.error('AI card art failed, using album cover')
                                e.currentTarget.src = cover
                            }} 
                        />*/}


                        <p className="text-purple-300 text-xs uppercase tracking-widest text-center mb-2">
                            Your Card
                        </p>
                        <h2 className="text-xl font-bold mb-1 text-purple-100">{title}</h2>
                        <p className="text-purple-200 mb-4">{artist}</p>

                        <div className="bg-gray-200 rounded-full h-1 mb-4">
                            <div
                                className="bg-blue-500 h-1 rounded-full transition-all"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            ></div>
                        </div>
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 mx-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition shadow-lg"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <div className="flex gap-2 mt-4 justify-center">

                            <a
                                href={`https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                Spotify
                            </a>

                            <a
                                href={`https://music.apple.com/search?term=${encodeURIComponent(title + ' ' + artist)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-full transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 00-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 002.174-2.488c.225-.51.326-1.05.38-1.6.058-.592.076-1.185.076-1.778V6.247c-.002-.04-.007-.08-.01-.123zM9.178 15.429v-7.97c0-.252.031-.5.093-.742.11-.43.314-.826.628-1.15.418-.43.92-.706 1.507-.87.653-.184 1.31-.233 1.977-.145.705.093 1.367.3 1.977.668.534.322.99.74 1.36 1.253.333.463.523.972.558 1.533.037.603-.065 1.188-.314 1.747-.297.665-.764 1.18-1.396 1.534-.436.244-.912.38-1.402.462-.636.106-1.27.065-1.89-.15-.49-.17-.93-.43-1.313-.79-.13-.123-.222-.274-.307-.432-.08-.148-.13-.306-.15-.472-.016-.14-.01-.28-.003-.418.01-.193.067-.37.193-.52.183-.218.42-.316.7-.34.664-.06 1.25.12 1.778.536.287.227.51.51.65.854.02.05.043.097.063.147.017.04.033.08.05.12.522-.254 1.01-.545 1.448-.94.505-.456.91-1.003 1.202-1.63.175-.376.272-.774.298-1.19.03-.473-.05-.928-.235-1.364-.277-.652-.733-1.17-1.34-1.558-.638-.408-1.343-.653-2.095-.755-.78-.106-1.553-.05-2.313.17-.88.255-1.62.712-2.207 1.402a3.88 3.88 0 00-.822 1.84 7.843 7.843 0 00-.082.855c-.004.085-.004.17-.004.256v7.97c0 .438.013.875.056 1.31.074.753.263 1.476.63 2.148.44.804 1.043 1.443 1.817 1.917.773.473 1.627.73 2.535.82.788.078 1.572.06 2.348-.133.93-.23 1.778-.632 2.523-1.234.61-.494 1.115-1.09 1.512-1.785.404-.71.67-1.473.798-2.28.12-.758.152-1.52.09-2.286-.073-.904-.283-1.772-.68-2.588a6.89 6.89 0 00-1.528-2.16c-.696-.66-1.495-1.166-2.39-1.508a8.186 8.186 0 00-2.807-.6c-.784-.033-1.564.023-2.334.19-.916.2-1.778.53-2.567 1.043-.887.576-1.615 1.315-2.163 2.218-.51.84-.822 1.752-.944 2.725-.11.88-.09 1.76.026 2.638.134 1.01.423 1.966.88 2.86.49.96 1.155 1.777 1.985 2.442a8.534 8.534 0 002.97 1.52c.99.295 2.007.44 3.042.463.85.018 1.695-.02 2.53-.16 1.032-.173 2.018-.476 2.947-.963.99-.52 1.863-1.207 2.602-2.063.01-.01.016-.025.025-.038-.01-.01-.017-.023-.026-.033-.543-.573-1.086-1.146-1.63-1.72-.01-.01-.022-.016-.034-.025-.01.01-.023.016-.033.026a6.812 6.812 0 01-2.054 1.446c-.837.404-1.724.627-2.653.71-.758.067-1.51.037-2.254-.12a5.943 5.943 0 01-2.078-.82 5.597 5.597 0 01-1.644-1.567 5.28 5.28 0 01-.802-1.835 6.092 6.092 0 01-.17-1.414z" />
                                </svg>
                                Apple Music
                            </a>
                        </div>

                        <audio
                            ref={audioRef}
                            src={preview}
                            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        />

                        <div className={`bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-sm border border-white/20 mt-4 transition-all duration-1000 delay-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>                    <p
                            className="text-center text-gray-100 italic leading-relaxed text-lg"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {reading}
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </CardReveal >

    )


}

export default TrackCard