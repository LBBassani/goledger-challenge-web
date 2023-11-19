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

export default function Song(){
    const {id} = useParams();
    const [songInfo, setSongInfo] = useState<ISong>();
    const [transactionText, setTransactionText] = useState('');
    const [showModal, setShowModal] = useState(false);
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
            setShowModal(false);
            enqueueSnackbar({message: 'Song updated successfully', variant: 'success'});
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
            showModal &&
            <Modal 
                title={`Editar ${songInfo?.title}`} 
                confirmText="Salvar"
                onClose={() => {setShowModal(false)}}
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
        <InfoPageHeader title={songInfo?.title ? songInfo?.title : 'Song Title' } onEdit={() => {setShowModal(true)}}></InfoPageHeader>
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