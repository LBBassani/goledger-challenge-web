import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistByKey } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";

export default function Playlist(){
    const {id} = useParams();
    const [playlistInfo, setPlaylistInfo] = useState<IPlaylist>();

   async function fetchPlaylistInfo(key: string) {
        const playlistInfoAsset = await getPlaylistByKey(key);
        setPlaylistInfo(playlistInfoAsset);
   }

   useEffect(()=> {
        if(id) fetchPlaylistInfo(id);
   }, [id]);

    return <>Playlist: {JSON.stringify(playlistInfo)}</>
}