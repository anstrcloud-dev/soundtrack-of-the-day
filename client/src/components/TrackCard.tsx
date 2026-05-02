

type TrackCardProps = {
    title: string
    artist: string
    cover: string
    preview: string
}


//Accept props: title, artist, cover, preview — all strings
//Return some JSX displaying them — for now just text and an image, don't worry about the audio player yet
const TrackCard = ({ title, artist, cover, preview }: TrackCardProps) => {

    return (
        <div>
            <img
                src={cover}
                alt={title}
            />

            <p>{title}</p>
            <p>{artist}</p>

        </div>
    )


}

export default TrackCard