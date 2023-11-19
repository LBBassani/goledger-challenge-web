import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAlbumByKey } from "../../api/albumApi/getAlbum";
import IAlbum from "../../types/album";
import ISong from "../../types/song";
import { getSongsByAlbumKey } from "../../api/songApi/getSong";
import { InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import { DateTime } from "luxon";
import { dateWithoutHourFormat } from "../../utils/dateFormat";
import ArtistPreview from "../../components/artist/artistPreview";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";
import Modal from "../../components/common/modal";
import AlbumEditForm from "../../components/album/albumEditForm";
import { InfoPageHeader } from "../../components/common/infoPage";
import { updateAlbumByKey } from "../../api/albumApi/updateAlbum";
import { deleteAlbumByKey } from "../../api/albumApi/deleteAlbum";
import { isAxiosError } from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

export default function Album(){
    const {id} = useParams();
    const [albumInfo, setAlbumInfo] = useState<IAlbum>();
    const [songList, setSongList] = useState<Array<ISong>>();
    const [albumDate, setAlbumDate] = useState<DateTime>(DateTime.now());
    const [transactionText, setTransactionText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [releaseDate, setReleaseDate] = useState('');
    const [rating, setRating] = useState('');
    const navigate = useNavigate();

    async function fetchAlbumInfo( key: string) {
        const albumAsset = await getAlbumByKey(key);
        setAlbumInfo(albumAsset);
        const songListAsset = await getSongsByAlbumKey(key);
        setSongList(songListAsset);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    async function updateAlbumInfo( rating:string, releaseDate: string) {
        if(albumInfo){
            enqueueSnackbar({message: 'Sending data', variant: 'info'});
            const newAlbumData = {...albumInfo, rating: parseInt(rating), releaseDate: DateTime.fromSQL(releaseDate).toUTC().toISO() || albumInfo.releaseDate};
            const newAlbumAsset = await updateAlbumByKey(newAlbumData);
            setAlbumInfo(newAlbumAsset);
            setShowEditModal(false);
            enqueueSnackbar({message: 'Album updated successfully', variant: 'success'});
        }
    }

    async function deleteAlbum() {
        if(albumInfo){
            enqueueSnackbar({message: 'Deleting data from server', variant: 'info'});
            try{
                await deleteAlbumByKey(albumInfo.key);
                enqueueSnackbar({message: 'Album deleted successfully', variant: 'success'});
                navigate('/album/');
            }catch(error){
                enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
                if(isAxiosError(error))
                    enqueueSnackbar({message: capitalizeFirstLetter(error.response?.data), variant: 'error'});
            }
        }
    }

    useEffect(()=> {
        if(id) fetchAlbumInfo(id);
    }, [id])

    useEffect(() => {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
    }, [])

    useEffect(() => {
        if(albumInfo){ 
            const newTransactionText = formatTransactionText(albumInfo.lastTouch.transactionType, albumInfo.lastTouch.byWho, albumInfo.lastTouch.timestamp);
            setAlbumDate(DateTime.fromISO(albumInfo.releaseDate));
            setTransactionText(newTransactionText);
            setRating(String(albumInfo.rating));
            setReleaseDate(DateTime.fromISO(albumInfo.releaseDate).toFormat('yyyy-MM-dd'));
        }
    }, [albumInfo])

    return <>
        {
            showEditModal &&
            <Modal 
                title={`Edit ${albumInfo?.title}`}
                confirmText="Save"
                onClose={() => {setShowEditModal(false)}}
                onConfirm={() => {updateAlbumInfo(rating, releaseDate)}}
            >
                <AlbumEditForm 
                    ratingValue={rating} 
                    ratingOnChange={setRating} 
                    releaseDateValue={releaseDate}
                    releaseDateOnChange={setReleaseDate}
                />
            </Modal>
        }
        {
            showDeleteModal && 
            <Modal
                title={`Delete ${albumInfo?.title}`}
                confirmText="Delete"
                onClose={() => {setShowDeleteModal(false)}}
                onConfirm={() => deleteAlbum()}
            >
                <InfoSection>
                    <InfoSectionTitle>Are you Sure?</InfoSectionTitle>
                    <p>This action cannot be undone. All values associated with this album will be lost.</p>
                </InfoSection>
            </Modal>
        }
        <InfoPageHeader 
            title={albumInfo?.title ? `${albumInfo?.title} (${albumDate?.year})` : 'Album Title'}
            onEdit={() => {setShowEditModal(true)}}
            onDelete={() => {setShowDeleteModal(true)}}
        />
        <p>{transactionText}</p>
        <InfoSection>
            <InfoSectionTitle>Description</InfoSectionTitle>
            <p>Rating: {albumInfo?.rating || 0}</p>
            <p>Release Date: {albumDate.toFormat(dateWithoutHourFormat)}</p>
        </InfoSection>
        <InfoSection>
            <InfoSectionTitle>Artist</InfoSectionTitle>
            {albumInfo?.artist && <ArtistPreview artist={albumInfo.artist}/>}
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