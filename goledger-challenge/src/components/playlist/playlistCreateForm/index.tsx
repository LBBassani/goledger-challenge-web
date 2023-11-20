import { useEffect, useState } from 'react';
import Modal from '../../common/modal';
import { useNavigate } from 'react-router-dom';
import { searchSongs } from '../../../api/songApi/getSong';
import TextInput from '../../common/textInput';
import CheckList from '../../common/checkList';
import { enqueueSnackbar } from 'notistack';
import { isAxiosError } from 'axios';
import createPlaylist from '../../../api/playlistApi/createPlaylist';

type PlaylistCreateFormProps = {
    onClose: () => void
}

export default function PlaylistCreateForm({onClose}: PlaylistCreateFormProps){
    
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [songKeyList, setSongKeyList] = useState<Array<string>>([]);
    const [songOptions, setSongOptions] = useState<Array<{label: string, value: string}>>([{label: 'Loading', value: 'null-song'}]);
    const navigate = useNavigate();

    async function getSongOptions() {
        const {songList: songListAsset} = await searchSongs('');
        const newSongOptions = songListAsset.map((songAsset) => {
            return {label: songAsset.title, value: songAsset.key}
        })
        setSongOptions(newSongOptions);
    }

    function closeForm(){
        setPlaylistName('');
        setPlaylistDescription('');
        setSongKeyList([])
        onClose();
    }

    async function create() {
        enqueueSnackbar({message: 'Sending data', variant: 'info'});
        try{
            const newPlaylist = await createPlaylist(playlistName, playlistDescription, songKeyList);
            closeForm();
            enqueueSnackbar({message: 'Playlist created successfully', variant: 'success'});
            navigate(`/playlist/${newPlaylist['@key']}`);
        }catch(error){
            enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
            if(isAxiosError(error)) enqueueSnackbar({message: error.response?.data, variant: 'error'});
        }
    }
    
    useEffect(() => {
        getSongOptions()
    }, [])

    return <Modal
        title='Create Playlist'
        confirmText='Create'
        onClose={closeForm}
        onConfirm={create}
    >
        <TextInput name='name' type='text' label='Name' value={playlistName} onChange={setPlaylistName}/>
        <TextInput name='description' type='textarea' label='Description' value={playlistDescription} onChange={setPlaylistDescription}/>
        <CheckList label='Songs' options={songOptions} values={songKeyList} changeValues={setSongKeyList}/>
    </Modal>
}