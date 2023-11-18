import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ISong from "../../types/song";
import { getSongByKey } from "../../api/getSong";
import List from "../../components/common/list";
import ArtistPreview from "../../components/artist/artistPreview";
import AlbumPreview from "../../components/album/albumPreview";
import { InfoPageTitle, InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";

export default function Song(){
    const {id} = useParams();
    const [songInfo, setSongInfo] = useState<ISong>();
    const [transactionText, setTransactionText] = useState('');

    async function fetchSongInfo(key: string) {
        const songAsset = await getSongByKey(key);
        setSongInfo(songAsset);
        const newTransactionText = formatTransactionText(songAsset.lastTouch.transactionType, songAsset.lastTouch.byWho, songAsset.lastTouch.timestamp);
        setTransactionText(newTransactionText);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=>{
        if(id) fetchSongInfo(id);
    }, [id])

    useEffect(() => {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
    }, [])
    
    return <>
        <InfoPageTitle>{songInfo?.title ? songInfo?.title : 'Song Title' }</InfoPageTitle>
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