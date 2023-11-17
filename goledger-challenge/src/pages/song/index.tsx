import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ISong from "../../types/song";
import { getSongByKey } from "../../api/getSong";

export default function Song(){
    const {id} = useParams();
    const [songInfo, setSongInfo] = useState<ISong>();

    async function fetchSongInfo(key: string) {
        const songAsset = await getSongByKey(key);
        setSongInfo(songAsset);
    }

    useEffect(()=>{
        if(id) fetchSongInfo(id);
    }, [id]);
    
    return <>Song: {JSON.stringify(songInfo)}</>
}