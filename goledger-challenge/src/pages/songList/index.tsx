import { useEffect, useState } from "react";
import ISong from "../../types/song";
import { searchSongs } from "../../api/songApi/getSong";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import SongCreateForm from "../../components/song/songCreateForm";
import { InfoSection } from "../../components/common/infoPage/styles";

export default function SongList(){
    const [songList, setSongList] = useState<Array<ISong>>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    async function fetchSongs(search : string) {
        const songs = await searchSongs(search);
        setSongList(songs);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
        fetchSongs('');
    },[])
    return <>
        {
            showCreateModal &&
            <SongCreateForm
                onClose={() => {setShowCreateModal(false)}}
            />
        }
        <InfoPageHeader title="Songs" onCreate={() => setShowCreateModal(true)}/>
        <InfoSection>
            <List>
                {songList?.map((song) => {
                    return <SongPreview song={song} key={song.key}/>
                })}
            </List>
        </InfoSection>
    </>
}