import { useEffect, useState } from "react";
import ISong from "../../types/song";
import { searchSongs } from "../../api/getSong";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";

export default function SongList(){
    const [songList, setSongList] = useState<Array<ISong>>();
    async function fetchSongs(search : string) {
        const songs = await searchSongs(search);
        setSongList(songs);
    }

    useEffect(() => {
        fetchSongs('');
    },[])
    return <>
        <h2>Songs</h2>
        <List>
            {songList?.map((song) => {
                return <SongPreview song={song} key={song.key}/>
            })}
        </List>
    </>
}