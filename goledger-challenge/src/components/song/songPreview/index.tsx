import { Link } from "react-router-dom";
import ISong from "../../../types/song";

export default function SongPreview ({song} : {song: ISong}){
    return <div>
        <Link to={`/song/${song.key}`}>{song.title} {song.albumName && `(${song.albumName})`}</Link>
    </div>
}