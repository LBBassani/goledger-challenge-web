import { useEffect, useState } from "react";
import Modal from "../../common/modal";
import { searchArtists } from "../../../api/artistApi/getArtist";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { createAlbum } from "../../../api/albumApi/createAlbum";
import { isAxiosError } from "axios";
import TextInput from "../../common/textInput";
import DropDown from "../../common/dropDown";
import { DateTime } from "luxon";
import { Button } from "../../../styles";

type AlbumCreateFormProps = {
    onClose: () => void
}

export default function AlbumCreateForm({onClose}: AlbumCreateFormProps){

    const [albumTitle, setAlbumTitle] = useState('');
    const [albumRating, setAlbumRating] = useState(0);
    const [albumReleaseDate, setAlbumReleaseDate] = useState('');
    const [artistKey, setArtistKey] = useState('');
    const [artistOptions, setArtistOptions] = useState<Array<{label: string, value: string}>>([{label: 'Aguarde', value: 'null-artist'}]);
    const [artistOptionsBookmark, setArtistOptionsBookmark] = useState('');
    const navigate = useNavigate();

    async function getArtistOptions(oldArtistOptions: Array<{label: string, value: string}>, bookmark?: string) {
        const {artistList, bookmark: newBookmark} = await searchArtists('', bookmark);
        setArtistOptionsBookmark(newBookmark || '');
        if(artistList){
            const artistOptionsList = artistList.map((artist) => {return {label: artist.name, value: artist.key}});
            setArtistOptions([...oldArtistOptions, ...artistOptionsList]);
        }
    }

    useEffect(() => {
        getArtistOptions([]);
    }, [])

    function closeForm(){
        setAlbumRating(0);
        setAlbumReleaseDate('');
        setAlbumTitle('');
        setArtistKey('');
        onClose();
    }

    async function create() {
        enqueueSnackbar({message: 'Sending data', variant: 'info'});
        try{
            const newAlbum = await createAlbum(albumTitle, DateTime.fromSQL(albumReleaseDate).toUTC().toISO() || '', albumRating, artistKey);
            closeForm();
            enqueueSnackbar({message: 'Album created successfully', variant: 'success'});
            navigate(`/album/${newAlbum['@key']}`);
        }catch(error){
            enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
            if(isAxiosError(error)) enqueueSnackbar({message: error.response?.data, variant: 'error'});
        }
    }
    
    return <Modal 
        title="Create Album"
        onClose={closeForm}
        confirmText="Create"
        onConfirm={create}
        >
            <TextInput name="title" type="text" label="Title" value={albumTitle} onChange={setAlbumTitle}/>
            <TextInput type="number" label="Rating" name="rating" value={String(albumRating)} onChange={(value) => {setAlbumRating(parseInt(value))}}/>
            <TextInput type="date" label="Release Date" name="releaseDate" value={albumReleaseDate} onChange={setAlbumReleaseDate}/>
            <DropDown label="Artist" name="artist" onChange={setArtistKey} value={artistKey} options={artistOptions} />
            <>
                {
                    artistOptionsBookmark && 
                    <Button variant="primary" onClick={() => {
                        enqueueSnackbar({message: 'Loading...', variant: 'info'});
                        getArtistOptions(artistOptions, artistOptionsBookmark);
                    }}>
                        Load More Artists
                    </Button>
                }
            </>
        </Modal>
}