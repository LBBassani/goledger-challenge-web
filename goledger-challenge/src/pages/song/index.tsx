import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ISong from "../../types/song";
import { getSongByKey } from "../../api/songApi/getSong";
import List from "../../components/common/list";
import ArtistPreview from "../../components/artist/artistPreview";
import AlbumPreview from "../../components/album/albumPreview";
import { InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";
import Modal from "../../components/common/modal";
import SongEditForm from "../../components/song/songEditForm";
import IAlbum from "../../types/album";
import { InfoPageHeader } from "../../components/common/infoPage";
import { updateSongByKey } from "../../api/songApi/updateSong";
import { deleteSongByKey } from "../../api/songApi/deleteSong";
import { isAxiosError } from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

export default function Song(){
    const {id} = useParams();
    const [songInfo, setSongInfo] = useState<ISong>();
    const [transactionText, setTransactionText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [explicit, setExplicit] = useState(false);
    const [album, setAlbum] = useState<IAlbum>();
    const [albumKey, setAlbumKey] = useState('');

    async function fetchSongInfo(key: string) {
        const songAsset = await getSongByKey(key);
        setSongInfo(songAsset);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    async function updateSongInfo(explicit: boolean, albumKeyValue?: string) {
        if(songInfo){
            enqueueSnackbar({message: 'Sending Data', variant: 'info'});
            const newSongData = {
                ...songInfo,
                explicit,
                ...(album && {
                    album: {...album, key: albumKeyValue || album.key}
                })
            };
            const newSongInfo = await updateSongByKey(newSongData);
            setSongInfo(newSongInfo);
            setShowEditModal(false);
            enqueueSnackbar({message: 'Song updated successfully', variant: 'success'});
        }
    }

    async function deleteSong() {
        if(songInfo){
            enqueueSnackbar({message: 'Deleting data from server', variant: 'info'});
            try{
                await deleteSongByKey(songInfo.key);
                enqueueSnackbar({message: 'Album deleted successfully', variant: 'success'});
            }catch(error){
                enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
                if(isAxiosError(error))
                    enqueueSnackbar({message: capitalizeFirstLetter(error.response?.data), variant: 'error'});
            }
        }
    }

    useEffect(()=>{
        if(id) fetchSongInfo(id);
    }, [id])

    useEffect(() => {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
    }, [])

    useEffect(() => {
        if(songInfo){
            const newTransactionText = formatTransactionText(songInfo.lastTouch.transactionType, songInfo.lastTouch.byWho, songInfo.lastTouch.timestamp);
            setTransactionText(newTransactionText);
            setExplicit(songInfo.explicit);
            setAlbum(songInfo.album);
            setAlbumKey(songInfo.album?.key || '');
        }
    }, [songInfo])
    
    return <>
        {
            showEditModal &&
            <Modal 
                title={`Editar ${songInfo?.title}`} 
                confirmText="Salvar"
                onClose={() => {setShowEditModal(false)}}
                onConfirm={() => {updateSongInfo(explicit, albumKey)}}
            >
                <SongEditForm 
                    explicitValue={explicit} 
                    explicitOnChange={(value) => {setExplicit(value === 'true')}}
                    albumValue={albumKey}
                    albumOnChange={setAlbumKey}
                />
            </Modal>
        }
        {
            showDeleteModal && 
            <Modal
                title={`Delete ${songInfo?.title}`}
                confirmText="Delete"
                onClose={() => {setShowDeleteModal(false)}}
                onConfirm={() => deleteSong()}
            >
                <InfoSection>
                    <InfoSectionTitle>Are you Sure?</InfoSectionTitle>
                    <p>This action cannot be undone. All values associated with this album will be lost.</p>
                </InfoSection>
            </Modal>
        }
        <InfoPageHeader 
            title={songInfo?.title || 'Song Title' } 
            onEdit={() => {setShowEditModal(true)}}
            onDelete={() => {setShowDeleteModal(true)}}
        />
        <p>{transactionText}</p>
        <InfoSection>
            <InfoSectionTitle>Description</InfoSectionTitle>
            <p>Explict: {songInfo?.explicit ? 'yes' : 'no'}</p>
            <div>Album: {songInfo?.album && <AlbumPreview album={songInfo?.album}/>}</div>
        </InfoSection>

        <InfoSection>
        <InfoSectionTitle>Artists</InfoSectionTitle>
        <List>
            {songInfo?.artists?.map((artist) => {
                return <ArtistPreview artist={artist} key={artist.key}/>
            })}
        </List>
        </InfoSection>
    </>
}