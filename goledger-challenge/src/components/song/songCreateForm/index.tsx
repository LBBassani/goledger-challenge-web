import { useEffect, useState } from 'react';
import TextInput from '../../common/textInput';
import Modal from '../../common/modal';
import { enqueueSnackbar } from 'notistack';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { searchAlbums } from '../../../api/albumApi/getAlbum';
import { searchArtists } from '../../../api/artistApi/getArtist';
import CheckList from '../../common/checkList';
import DropDown from '../../common/dropDown';
import { createSong } from '../../../api/songApi/createSong';
 
type SongCreateFormProps = {
    onClose: () => void
}

export default function SongCreateForm({onClose} : SongCreateFormProps){

    const [songTitle, setSongTitle] = useState('');
    const [albumKey, setAlbumKey] = useState('');
    const [explicit, setExplicit] = useState(false);
    const [artistKeyList, setArtistKeyList] = useState<Array<string>>([]);
    const navigate = useNavigate();
    const [albumOptions, setAlbumOptions] = useState<Array<{label: string, value: string}>>([{label: 'Aguarde', value: 'null-album'}]);
    const [artistOptions, setArtistOptions] = useState<Array<{label: string, value: string}>>([{label: 'Aguarde', value: 'null-artist'}]);
    async function getAlbumOptions() {
        const {albumList} = await searchAlbums('');
        if(albumList){
            const albumOptionsList = albumList.map((albumOption) => {return {label: albumOption.title, value: albumOption.key}});
            setAlbumOptions(albumOptionsList);
        }
    }

    async function getArtistOptions() {
        const {artistList} = await searchArtists('');
        if(artistList){
            const artistOptionsList = artistList.map((artist) => {return {label: artist.name, value: artist.key}});
            setArtistOptions(artistOptionsList);
        }
    }

    useEffect(() => {
        getAlbumOptions();
        getArtistOptions();
    }, [])

    function closeForm(){
        setSongTitle('');
        setAlbumKey('');
        setExplicit(false);
        setArtistKeyList([]);
        onClose();
    }

    async function create() {
        enqueueSnackbar({message: 'Sending data', variant: 'info'});
        try{
            const newSong = await createSong(songTitle, explicit, albumKey, artistKeyList);
            closeForm();
            enqueueSnackbar({message: 'Song created successfully', variant: 'success'});
            navigate(`/song/${newSong['@key']}`);
        }catch(error){
            enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
            if(isAxiosError(error)) enqueueSnackbar({message: error.response?.data, variant: 'error'});
        }
    }

    return <Modal
        onClose={closeForm}
        title='Create Song'
        confirmText='Create'
        onConfirm={create}
    >
        <TextInput name='name' type='text' label='Name' value={songTitle} onChange={setSongTitle}/>
        <TextInput name='explicit' type='checkbox' label='Explicit' value={String(explicit)} onChange={(value) => {setExplicit(value === 'true')} }/>
        <DropDown label='Album' name='album' options={albumOptions} value={albumKey} onChange={setAlbumKey} />
        <CheckList label='Artists' options={artistOptions} values={artistKeyList} changeValues={setArtistKeyList}/>
    </Modal>
}