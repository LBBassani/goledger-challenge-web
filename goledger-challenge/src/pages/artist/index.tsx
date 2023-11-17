import { useParams } from "react-router-dom";
import { getArtistByKey } from "../../api/getArtist";
import { useEffect, useState } from "react";
import IArtist from "../../types/artist";
import { getSongsByArtistKey } from "../../api/getSong";
import ISong from "../../types/song";
import IAlbum from "../../types/album";
import { getAlbumsByArtistKey } from "../../api/getAlbum";

export default function Artist(){
    const {id} = useParams();
    const [artist, setArtist] = useState<IArtist>();
    const [songList, setSongList] = useState<ISong[]>();
    const [albumList, setAlbumList] = useState<IAlbum[]>();

    async function fetchArtist(id: string) {
        const artistAsset = await getArtistByKey(id);
        setArtist(artistAsset);
        const albumListAsset = await getAlbumsByArtistKey(id);
        setAlbumList(albumListAsset);
        const songListAsset = await getSongsByArtistKey(id);
        setSongList(songListAsset);
    }

    useEffect(() => {
        if(id) fetchArtist(id);
    }, [id])

    return <>
                Artist: {JSON.stringify(artist)} 
                AlbumList: {JSON.stringify(albumList)}
                SongList: {JSON.stringify(songList)}
            </>
}