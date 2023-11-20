import { useContext, useEffect, useState } from "react"
import List from "../../components/common/list";
import { searchPlaylist } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";
import PlaylistPreview from "../../components/playlist/playlistPreview";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import PlaylistCreateForm from "../../components/playlist/playlistCreateForm";
import { InfoSection } from "../../components/common/infoPage/styles";
import { SearchContext } from "../../App";

export default function PlaylistList(){
    const [playlistList, setPlaylistList] = useState<Array<IPlaylist>>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchPlaylists(search:string) {
        const playlistsAsset = await searchPlaylist(search);
        setPlaylistList(playlistsAsset);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
        fetchPlaylists(searchString);
    }, [searchString]);

    useEffect(() => {
        setShowSearchBar(true);
    }, [])
    
    return <>
        {
            showCreateModal &&
            <PlaylistCreateForm
                onClose={() => {setShowCreateModal(false)}}
            />
        }
        <InfoPageHeader 
            title="Playlists"
            onCreate={() => {setShowCreateModal(true)}}
        />
        <InfoSection>
            <List>
                {playlistList?.map((playlist)=> {
                    return <PlaylistPreview playlist={playlist} key={playlist.key}/>
                })}
            </List>
        </InfoSection>
    </>
}