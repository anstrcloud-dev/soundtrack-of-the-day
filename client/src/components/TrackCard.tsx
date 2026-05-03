import { useState, useRef } from "react"

type TrackCardProps = {
    title: string
    artist: string
    cover: string
    preview: string
}



//Accept props: title, artist, cover, preview — all strings
//Return some JSX displaying them — for now just text and an image, don't worry about the audio player yet
const TrackCard = ({ title, artist, cover, preview }: TrackCardProps) => {
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


    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-sm border border-white/20">
            <img
                src={cover}
                alt={title}
                className="w-full rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-1">{title}</h2>
            <p className="text-black mb-4">{artist}</p>

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

            <audio
                ref={audioRef}
                src={preview}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            />
        </div>
    )


}

export default TrackCard