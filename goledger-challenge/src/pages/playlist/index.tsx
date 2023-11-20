import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistByKey } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";
import { EmptyStateText, InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import Modal from "../../components/common/modal";
import PlaylistEditForm from "../../components/playlist/playlistEditForm";
import { updatePlaylistByKey } from "../../api/playlistApi/updatePlaylist";
import { deletePlaylistByKey } from "../../api/playlistApi/deletePlaylist";
import { isAxiosError } from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import { SearchContext } from "../../App";

export default function Playlist(){
     const {id} = useParams();
     const {setSearchString, setShowSearchBar} = useContext(SearchContext);
     const [playlistInfo, setPlaylistInfo] = useState<IPlaylist>();
     const [transactionText, setTransactionText] = useState('');
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [showEditModal, setShowEditModal] = useState(false);
     const [playlistSongs, setPlaylistSongs] = useState<Array<string>>([]);
     const [description, setDescriptionValue] = useState('');
     const navigate = useNavigate();

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
               setShowEditModal(false);
               enqueueSnackbar({message: 'Playlist updated successfully', variant: 'success'});
          }
     }

     async function deletePlaylist() {
          if(playlistInfo){
               enqueueSnackbar({message: 'Deleting data from server', variant: 'info'});
               try{
                    await deletePlaylistByKey(playlistInfo.key);
                    enqueueSnackbar({message: 'Playlist deleted successfully', variant: 'success'});
                    navigate('/playlist/');
               }catch(error){
                    enqueueSnackbar({message: 'Something went wrong', variant: 'error'});
                    if(isAxiosError(error))
                         enqueueSnackbar({message: capitalizeFirstLetter(error.response?.data), variant: 'error'});
               }
          }
     }

     useEffect(()=> {
          if(id) fetchPlaylistInfo(id);
     }, [id])

     useEffect(() => {
          enqueueSnackbar({message: 'Loading...', variant: 'info'});
          setSearchString('');
          setShowSearchBar(false);
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
               showEditModal &&
               <Modal 
                    title={`Editar ${playlistInfo?.name}`}
                    onClose={() => {setShowEditModal(false)}}
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
          {
               showDeleteModal && 
               <Modal
                    title={`Delete ${playlistInfo?.name}`}
                    confirmText="Delete"
                    onClose={() => {setShowDeleteModal(false)}}
                    onConfirm={() => deletePlaylist()}
               >
                    <InfoSection>
                         <InfoSectionTitle>Are you Sure?</InfoSectionTitle>
                         <p>This action cannot be undone. All values associated with this album will be lost.</p>
                    </InfoSection>
               </Modal>
          }
          <InfoPageHeader 
               title={playlistInfo?.name || 'Playlist'}
               subtitle={transactionText}
               onEdit={() => {setShowEditModal(true)}}
               onDelete={() => {setShowDeleteModal(true)}}
          />
          <InfoSection>
               <InfoSectionTitle>Description</InfoSectionTitle>
               <p>About: {playlistInfo?.description}</p>
          </InfoSection>
          <InfoSection>
               <InfoSectionTitle>Songs</InfoSectionTitle>
               {
                    playlistInfo?.songs && playlistInfo.songs.length ?
                    <List>
                         {playlistInfo.songs.map((song) => {
                              return <SongPreview song={song} key={song.key}/>
                         })}
                    </List>
                    :
                    <EmptyStateText>There is nothing to see here</EmptyStateText>
               }
          </InfoSection>
     </>
}