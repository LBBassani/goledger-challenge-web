import { useEffect, useState } from "react"
import List from "../../components/common/list";
import { searchPlaylist } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";
import PlaylistPreview from "../../components/playlist/playlistPreview";

export default function PlaylistList(){
    const [playlistList, setPlaylistList] = useState<Array<IPlaylist>>();
    
    async function fetchPlaylists(search:string) {
        const playlistsAsset = await searchPlaylist(search);
        setPlaylistList(playlistsAsset);
    }

    useEffect(()=> {
        fetchPlaylists('');
    }, []);
    
    return <>
        <h2>Playlists</h2>
        <List>
            {playlistList?.map((playlist)=> {
                return <PlaylistPreview playlist={playlist} key={playlist.key}/>
            })}
        </List>
    </>
}