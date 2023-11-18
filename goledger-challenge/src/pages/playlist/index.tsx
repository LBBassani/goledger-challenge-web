import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistByKey } from "../../api/playlistApi/getPlaylist";
import IPlaylist from "../../types/playlist";
import { InfoPageTitle, InfoSection, InfoSectionTitle } from "../../styles/infoPage";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";

export default function Playlist(){
     const {id} = useParams();
     const [playlistInfo, setPlaylistInfo] = useState<IPlaylist>();
     const [transactionText, setTransactionText] = useState('');

     async function fetchPlaylistInfo(key: string) {
          const playlistInfoAsset = await getPlaylistByKey(key);
          setPlaylistInfo(playlistInfoAsset);
          const newTransactionText = formatTransactionText(playlistInfoAsset.lastTouch.transactionType, playlistInfoAsset.lastTouch.byWho, playlistInfoAsset.lastTouch.timestamp);
          setTransactionText(newTransactionText);
          enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
     }

     useEffect(()=> {
          if(id) fetchPlaylistInfo(id);
     }, [id])

     useEffect(() => {
          enqueueSnackbar({message: 'Loading...', variant: 'info'});
     }, [])

     return <>
          <InfoPageTitle>{playlistInfo?.name || 'Playlist'}</InfoPageTitle>
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