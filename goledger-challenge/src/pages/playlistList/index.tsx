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
import { Button } from "../../styles";

export default function PlaylistList(){
    const [playlistList, setPlaylistList] = useState<Array<IPlaylist>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nextPageBookmark, setBookmark] = useState('');
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchPlaylists(search:string, bookmark?: string) {
        const {playlistList: playlistsAsset, bookmark : newBookmark} = await searchPlaylist(search, bookmark);
        setPlaylistList([...playlistList,...playlistsAsset]);
        setBookmark(newBookmark || '');
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
        setPlaylistList([]);
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
        <InfoSection>
            {
                nextPageBookmark &&
                <Button variant="primary" onClick={() =>{ 
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    fetchPlaylists(searchString, nextPageBookmark);
                }}>Load More Playlists</Button>
            }
        </InfoSection>
    </>
}