import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistByKey } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";
import { InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import Modal from "../../components/common/modal";
import PlaylistEditForm from "../../components/playlist/playlistEditForm";
import { updatePlaylistByKey } from "../../api/playlistApi/updatePlaylist";

export default function Playlist(){
     const {id} = useParams();
     const [playlistInfo, setPlaylistInfo] = useState<IPlaylist>();
     const [transactionText, setTransactionText] = useState('');
     const [showModal, setShowModal] = useState(false);
     const [playlistSongs, setPlaylistSongs] = useState<Array<string>>([]);
     const [description, setDescriptionValue] = useState('');

     async function fetchPlaylistInfo(key: string) {
          const playlistInfoAsset = await getPlaylistByKey(key);
          setPlaylistInfo(playlistInfoAsset);
          enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
     }

     async function updatePlaylistInfo(description: string, songs: Array<string>){
          if(playlistInfo){
               enqueueSnackbar({message: 'Sending data', variant: 'info'});
               const newPlaylistData = {...playlistInfo, description};
               const newPlaylistAsset = await updatePlaylistByKey(newPlaylistData, songs);
               setPlaylistInfo(newPlaylistAsset);
               setShowModal(false);
               enqueueSnackbar({message: 'Playlist updated successfully', variant: 'success'});
          }
     }

     useEffect(()=> {
          if(id) fetchPlaylistInfo(id);
     }, [id])

     useEffect(() => {
          enqueueSnackbar({message: 'Loading...', variant: 'info'});
     }, [])

     useEffect(()=> {
          if(playlistInfo){
               const newTransactionText = formatTransactionText(playlistInfo.lastTouch.transactionType, playlistInfo.lastTouch.byWho, playlistInfo.lastTouch.timestamp);
               setTransactionText(newTransactionText);
               const newSongList = playlistInfo.songs?.map((song) => {
                    return song.key
               })
               setPlaylistSongs(newSongList || []);
               setDescriptionValue(playlistInfo.description);
          }
     }, [playlistInfo])

     return <>
          {
               showModal &&
               <Modal 
                    title={`Editar ${playlistInfo?.name}`}
                    onClose={() => {setShowModal(false)}}
                    onConfirm={() => updatePlaylistInfo(description, playlistSongs)}
               >
                    <PlaylistEditForm 
                         descriptionValue={description} 
                         descriptionOnChange={setDescriptionValue}
                         songValues={playlistSongs}
                         songValuesOnChange={setPlaylistSongs}
                    />
               </Modal>
          }
          <InfoPageHeader 
               title={playlistInfo?.name || 'Playlist'}
               onEdit={() => {setShowModal(true)}}
          />
          <p>{transactionText}</p>
          <InfoSection>
               <InfoSectionTitle>Description</InfoSectionTitle>
               <p>About: {playlistInfo?.description}</p>
          </InfoSection>
          <InfoSection>
               <InfoSectionTitle>Songs</InfoSectionTitle>
               <List>
                    {playlistInfo?.songs?.map((song) => {
                         return <SongPreview song={song} key={song.key}/>
                    })}
               </List>
          </InfoSection>
     </>
}