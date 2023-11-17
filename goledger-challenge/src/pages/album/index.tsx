import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumByKey } from "../../api/getAlbum";
import IAlbum from "../../types/album";
import ISong from "../../types/song";
import { getSongsByAlbumKey } from "../../api/getSong";

export default function Album(){
    const {id} = useParams();
    const [albumInfo, setAlbumInfo] = useState<IAlbum>();
    const [songList, setSongList] = useState<Array<ISong>>();

    async function fetchAlbumInfo( key: string) {
        const albumAsset = await getAlbumByKey(key);
        setAlbumInfo(albumAsset);
        const songListAsset = await getSongsByAlbumKey(key);
        setSongList(songListAsset);
    }

    useEffect(()=> {
        if(id) fetchAlbumInfo(id);
    }, [id]);

    return <>
                Album Info: {JSON.stringify(albumInfo)}
                Song List: {JSON.stringify(songList)}
            </>
}