import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumByKey } from "../../api/getAlbum";
import IAlbum from "../../types/album";
import ISong from "../../types/song";
import { getSongsByAlbumKey } from "../../api/getSong";
import { InfoPageTitle, InfoSection, InfoSectionTitle } from "../../components/common/infoPage/styles";
import { DateTime } from "luxon";
import { dateWithoutHourFormat } from "../../utils/dateFormat";
import ArtistPreview from "../../components/artist/artistPreview";
import List from "../../components/common/list";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";
import { enqueueSnackbar } from "notistack";

export default function Album(){
    const {id} = useParams();
    const [albumInfo, setAlbumInfo] = useState<IAlbum>();
    const [songList, setSongList] = useState<Array<ISong>>();
    const [albumDate, setAlbumDate] = useState<DateTime>(DateTime.now());
    const [transactionText, setTransactionText] = useState('');

    async function fetchAlbumInfo( key: string) {
        const albumAsset = await getAlbumByKey(key);
        setAlbumInfo(albumAsset);
        const songListAsset = await getSongsByAlbumKey(key);
        setSongList(songListAsset);
        setAlbumDate(DateTime.fromISO(albumAsset.releaseDate));
        const newTransactionText = formatTransactionText(albumAsset.lastTouch.transactionType, albumAsset.lastTouch.byWho, albumAsset.lastTouch.timestamp);
        setTransactionText(newTransactionText);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(()=> {
        if(id) fetchAlbumInfo(id);
    }, [id])

    useEffect(() => {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});
    }, [])

    return <>
                <InfoPageTitle>{albumInfo?.title ? `${albumInfo?.title} (${albumDate?.year})` : 'Album Title'}</InfoPageTitle>
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