import { useNavigate, useParams } from "react-router-dom";
import { getArtistByKey } from "../../api/artistApi/getArtist";
import { useEffect, useState } from "react";
import IArtist from "../../types/artist";
import { getSongsByArtistKey } from "../../api/songApi/getSong";
import ISong from "../../types/song";
import IAlbum from "../../types/album";
import { getAlbumsByArtistKey } from "../../api/albumApi/getAlbum";
import { InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import List from "../../components/common/list";
import AlbumPreview from "../../components/album/albumPreview";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";
import Modal from "../../components/common/modal";
import { InfoPageHeader } from "../../components/common/infoPage";
import ArtistEditForm from "../../components/artist/artistEditForm";
import { updateArtistByKey } from "../../api/artistApi/updateArtist";
import { deleteArtistByKey } from "../../api/artistApi/deleteArtist";
import { isAxiosError } from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

export default function Artist(){
    const {id} = useParams();
    const [artist, setArtist] = useState<IArtist>();
    const [songList, setSongList] = useState<ISong[]>();
    const [albumList, setAlbumList] = useState<IAlbum[]>();
    const [transactionText, setTransactionText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [aboutValue, setAboutValue] = useState('');
    const navigate = useNavigate();

    async function fetchArtist(id: string) {
        const artistAsset = await getArtistByKey(id);
        setArtist(artistAsset);
        const albumListAsset = await getAlbumsByArtistKey(id);
        setAlbumList(albumListAsset);
        const songListAsset = await getSongsByArtistKey(id);
        setSongList(songListAsset);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    async function updateArtist(about: string) {
        if(artist){
            enqueueSnackbar({message: 'Sending data', variant: 'info'});
            const newArtistData = {...artist, about};
            const newArtistAsset = await updateArtistByKey(newArtistData);
            setArtist(newArtistAsset);
            setShowEditModal(false);
            enqueueSnackbar({message: 'Artist updated successfully', variant: 'success'});
        }
    }

    async function deleteArtist() {
        if(artist){
            enqueueSnackbar({message: 'Deleting data from server', variant: 'info'});
            try{
                await deleteArtistByKey(artist.key);
                enqueueSnackbar({message: 'Artist deleted successfully', variant: 'success'});
                navigate('/artist/')
            }catch(error){
                enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
                if(isAxiosError(error))
                    enqueueSnackbar({message: capitalizeFirstLetter(error.response?.data), variant: 'error'});
            }
        }
    }

    useEffect(() => {
        if(id) fetchArtist(id);
    }, [id])

    useEffect(() => {
        if(artist){ 
            const newTransactionText = formatTransactionText(artist.lastTouch.transactionType, artist.lastTouch.byWho, artist.lastTouch.timestamp);
            setTransactionText(newTransactionText);
            setAboutValue(artist.about);
        }
    }, [artist])

    useEffect(() => {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
    }, [])

    return <>
            {
                showEditModal && 
                <Modal 
                    title={`Edit ${artist?.name}`} 
                    confirmText="Save" 
                    onClose={() => {setShowEditModal(false)}}
                    onConfirm={() => {updateArtist(aboutValue)}}
                >
                    <ArtistEditForm aboutValue={aboutValue} aboutOnChange={setAboutValue} />
                </Modal>
            }
            {
            showDeleteModal && 
            <Modal
                title={`Delete ${artist?.name}`}
                confirmText="Delete"
                onClose={() => {setShowDeleteModal(false)}}
                onConfirm={() => deleteArtist()}
            >
                <InfoSection>
                    <InfoSectionTitle>Are you Sure?</InfoSectionTitle>
                    <p>This action cannot be undone. All values associated with this album will be lost.</p>
                </InfoSection>
            </Modal>
        }
            <InfoPageHeader 
                title={artist?.name || 'Artist Name'} 
                subtitle={transactionText}
                onEdit={() => {setShowEditModal(true)}} 
                onDelete={() => {setShowDeleteModal(true)}}
            />
            <InfoSection>
                <InfoSectionTitle>Description</InfoSectionTitle>
                <p>About: {artist?.about}</p>
            </InfoSection>
            <InfoSection>
                <InfoSectionTitle>Albums</InfoSectionTitle>
                <List>
                    {albumList?.map((album) => {
                        return <AlbumPreview album={album} key={album.key}/>
                    })}
                </List>
            </InfoSection>
            <InfoSection>
                <InfoSectionTitle>Songs</InfoSectionTitle>
                <List>
                    {songList?.map((song) => {
                        return <SongPreview song={song} key={song.key}/>
                    })}
                </List>
            </InfoSection>
        </>
}