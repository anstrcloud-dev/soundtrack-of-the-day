import { useState, useRef, useEffect } from "react"
import CardReveal from './CardReveal'
import html2canvas from 'html2canvas'


type TrackCardProps = {
    title: string
    artist: string
    cover: string
    preview: string
    reading: string
    // cardArt: string
    onFinishSplash?: () => void //card

}



//Accept props: title, artist, cover, preview — all strings
//Return some JSX displaying them — for now just text and an image, don't worry about the audio player yet
const TrackCard = ({ title, artist, cover, preview, reading, onFinishSplash }: TrackCardProps) => {
    const [isPlaying, setIsPlaying] = useState(false) // start as false (not playing)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(30)
    const [isCapturing, setIsCapturing] = useState(false)

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play()
        }
        setIsPlaying(!isPlaying)
    }


    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Audiomancy Card',
                    text: `${title} by ${artist}\n\n${reading}`,
                    url: window.location.href
                })
            } catch (err) {
                console.log('Share cancelled')
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${title} by ${artist}\n\n${reading}\n\n${window.location.href}`)
            alert('Link copied to clipboard!')
        }
    }


    const cardRef = useRef<HTMLDivElement>(null)

    const handleSave = async () => {
        if (!cardRef.current) return

        try {
            setIsCapturing(true) //hide buttons
            await new Promise(resolve => setTimeout(resolve, 100)) //let state update
            // await new Promise(resolve => setTimeout(resolve, 500)) //wait for images to load

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true, //important for loading external images
                allowTaint: true
            })

            setIsCapturing(false) //show buttons again

            const link = document.createElement('a')
            link.download = `audiomancy-${title.replace(/\s+/g, '-')}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (error) {
            console.error('Failed to save image:', error)
            setIsCapturing(false)
        }
    }

    //animation
    const [revealed, setRevealed] = useState(false)
    useEffect(() => {
        setTimeout(() => setRevealed(true), 300)
    }, [])


    return (
        <CardReveal onFinishSplash={onFinishSplash}>
            <div className="flex gap-4 items-start">
                <div className={`transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    <div ref={cardRef} className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-sm border border-white/20">                        <img
                        src={cover}
                        //src={cardArt}

                        alt={title}

                        className="w-full rounded-md mb-4"
                    />
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

                        {/* Progress bar */}
                        <div className={`bg-gray-200 rounded-full h-1 mb-4 ${isCapturing ? 'hidden' : ''}`}>
                            <div
                                className="bg-blue-500 h-1 rounded-full transition-all"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            ></div>
                        </div>

                        {/* Play button */}
                        <button
                            onClick={togglePlay}
                            className={`w-12 h-12 mx-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition shadow-lg ${isCapturing ? 'hidden' : ''}`}
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

                        <div className={`flex gap-2 mt-4 justify-center ${isCapturing ? 'hidden' : ''}`}>

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
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
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

                        {/* Reading card */}
                        <div className={`bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-sm border border-white/20 mt-4 transition-all duration-1000 delay-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>                    <p
                            className="text-center text-gray-100 italic leading-relaxed text-lg"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {reading}
                        </p>
                        </div>

                    </div>

                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button
                        onClick={handleShare}
                        className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition shadow-lg"
                        title="Share"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    <button
                        onClick={handleSave}
                        className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition shadow-lg"
                        title="Save as image"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>

        </CardReveal >

    )


}

export default TrackCard