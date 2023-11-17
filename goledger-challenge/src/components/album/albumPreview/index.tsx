import { Link } from "react-router-dom";
import IAlbum from "../../../types/album";

export default function AlbumPreview({album} : { album: IAlbum}) {
    const year = new Date(album.releaseDate).getFullYear();
    return <div>
        <Link to={`/album/${album.key}`}>{album.title} ({year}) {album.artist && `- ${album.artist.name}`}</Link>
    </div>
}