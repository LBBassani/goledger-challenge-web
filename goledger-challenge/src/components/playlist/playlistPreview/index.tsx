import { Link } from "react-router-dom";
import IPlaylist from "../../../types/playlist";

export default function PlaylistPreview({playlist} : {playlist: IPlaylist}){

    return <div>
        <Link to={`/playlist/${playlist.key}`}>{playlist.name} ({playlist.size} songs)</Link>
    </div>
}