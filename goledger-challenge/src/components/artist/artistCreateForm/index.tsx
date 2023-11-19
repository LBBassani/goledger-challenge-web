import { useState } from 'react';
import TextInput from '../../common/textInput';
import Modal from '../../common/modal';
import { createArtist } from '../../../api/artistApi/createArtist';
import { enqueueSnackbar } from 'notistack';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
 
type ArtistCreateFormProps = {
    onClose: () => void
}

export default function ArtistCreateForm({onClose} : ArtistCreateFormProps){

    const [artistName, setArtistName] = useState('');
    const [artistDescription, setArtistDescription] = useState('');
    const navigate = useNavigate();

    function closeForm(){
        setArtistName('');
        setArtistDescription('');
        onClose();
    }

    async function create() {
        enqueueSnackbar({message: 'Sending data', variant: 'info'});
        try{
            const newArtist = await createArtist(artistName, artistDescription);
            closeForm();
            enqueueSnackbar({message: 'Artist created successfully', variant: 'success'});
            navigate(`/artist/${newArtist['@key']}`);
        }catch(error){
            enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
            if(isAxiosError(error)) enqueueSnackbar({message: error.response?.data, variant: 'error'});
        }
    }

    return <Modal
        onClose={closeForm}
        title='Create Artist'
        confirmText='Create'
        onConfirm={create}
    >
        <TextInput name='name' type='text' label='Name' value={artistName} onChange={setArtistName}/>
        <TextInput name='about' type='textarea' label='About' value={artistDescription} onChange={setArtistDescription}/> 
    </Modal>
}