import { useContext, useEffect, useState } from "react"
import List from "../../components/common/list";
import { searchPlaylist } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";
import PlaylistPreview from "../../components/playlist/playlistPreview";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import PlaylistCreateForm from "../../components/playlist/playlistCreateForm";
import { EmptyStateText, InfoSection } from "../../components/common/infoPage/styles";
import { SearchContext } from "../../App";
import { Button } from "../../styles";

export default function PlaylistList(){
    const [playlistList, setPlaylistList] = useState<Array<IPlaylist>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nextPageBookmark, setBookmark] = useState('');
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchPlaylists(oldList: Array<IPlaylist>, search:string, bookmark?: string) {
        const {playlistList: playlistsAsset, bookmark : newBookmark} = await searchPlaylist(search, bookmark);
        setPlaylistList([...oldList,...playlistsAsset]);
        setBookmark(newBookmark || '');
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
        fetchPlaylists([], searchString);
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
            {
                playlistList && playlistList.length > 0 ?
                <List>
                    {playlistList.map((playlist)=> {
                        return <PlaylistPreview playlist={playlist} key={playlist.key}/>
                    })}
                </List>
                :
                <EmptyStateText>There is nothing to see here</EmptyStateText>
            }
        </InfoSection>
        <InfoSection>
            {
                nextPageBookmark &&
                <Button variant="primary" onClick={() =>{ 
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    fetchPlaylists(playlistList, searchString, nextPageBookmark);
                }}>Load More Playlists</Button>
            }
        </InfoSection>
    </>
}