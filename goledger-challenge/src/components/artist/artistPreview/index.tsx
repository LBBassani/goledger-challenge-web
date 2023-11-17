import { Link } from "react-router-dom";
import IArtist from "../../../types/artist";



export default function ArtistPreview({artist} : {artist: IArtist}){

    const {name, key} = artist;
    return <div>
        <Link to={`/artist/${key}`}>{name}</Link>
    </div> 
}