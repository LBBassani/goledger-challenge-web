import { useContext, useEffect, useState } from "react";
import ISong from "../../types/song";
import { searchSongs } from "../../api/songApi/getSong";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import SongCreateForm from "../../components/song/songCreateForm";
import { EmptyStateText, InfoSection } from "../../components/common/infoPage/styles";
import { SearchContext } from "../../App";
import { Button } from "../../styles";

export default function SongList(){
    const [songs, setSongList] = useState<Array<ISong>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nextPageBookmark, setBookmark] = useState('');
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchSongs(search : string, nextBookmark?: string) {
        const {songList, bookmark} = await searchSongs(search, nextBookmark);
        setSongList([...songs, ...songList]);
        setBookmark(bookmark || '');
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
        setSongList([]);
        fetchSongs(searchString);
    },[searchString])

    useEffect(() => {
        setShowSearchBar(true);
    }, [])

    return <>
        {
            showCreateModal &&
            <SongCreateForm
                onClose={() => {setShowCreateModal(false)}}
            />
        }
        <InfoPageHeader title="Songs" onCreate={() => setShowCreateModal(true)}/>
        <InfoSection>
            {
                songs && songs.length > 0 ?
                <List>
                    {songs.map((song) => {
                        return <SongPreview song={song} key={song.key}/>
                    })}
                </List>
                :
                <EmptyStateText>There is nothing to see here</EmptyStateText>
            }
        </InfoSection>
        <InfoSection>
            {
                nextPageBookmark &&
                <Button variant="primary" onClick={() => {
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    fetchSongs(searchString, nextPageBookmark);
                }}>Load More Songs</Button>
            }
        </InfoSection>
    </>
}