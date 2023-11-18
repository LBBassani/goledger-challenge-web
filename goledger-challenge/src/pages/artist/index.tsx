import { useParams } from "react-router-dom";
import { getArtistByKey } from "../../api/artistApi/getArtist";
import { useEffect, useState } from "react";
import IArtist from "../../types/artist";
import { getSongsByArtistKey } from "../../api/getSong";
import ISong from "../../types/song";
import IAlbum from "../../types/album";
import { getAlbumsByArtistKey } from "../../api/getAlbum";
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

export default function Artist(){
    const {id} = useParams();
    const [artist, setArtist] = useState<IArtist>();
    const [songList, setSongList] = useState<ISong[]>();
    const [albumList, setAlbumList] = useState<IAlbum[]>();
    const [transactionText, setTransactionText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [aboutValue, setAboutValue] = useState('');

    async function fetchArtist(id: string) {
        const artistAsset = await getArtistByKey(id);
        setArtist(artistAsset);
        setAboutValue(artistAsset.about);
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
            setShowModal(false);
            enqueueSnackbar({message: 'Artist updated successfully', variant: 'success'});
        }
    }

    useEffect(() => {
        if(id) fetchArtist(id);
    }, [id])

    useEffect(() => {
        if(artist){ 
            const newTransactionText = formatTransactionText(artist.lastTouch.transactionType, artist.lastTouch.byWho, artist.lastTouch.timestamp);
            setTransactionText(newTransactionText);
        }
    }, [artist])

    useEffect(() => {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
    }, [])

    return <>
            {
                showModal && 
                <Modal 
                    title={`Editar ${artist?.name}`} 
                    confirmText="Salvar" 
                    onClose={() => {setShowModal(false)}}
                    onConfirm={() => {updateArtist(aboutValue)}}
                >
                    <ArtistEditForm aboutValue={aboutValue} aboutOnChange={setAboutValue} />
                </Modal>
            }
            <InfoPageHeader title={artist?.name || 'Artist Name'} onEdit={() => {setShowModal(true)}} onDelete={() => {}}/>
            <p>{transactionText}</p>
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