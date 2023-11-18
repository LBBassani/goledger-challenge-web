import { useParams } from "react-router-dom";
import { getArtistByKey } from "../../api/getArtist";
import { useEffect, useState } from "react";
import IArtist from "../../types/artist";
import { getSongsByArtistKey } from "../../api/getSong";
import ISong from "../../types/song";
import IAlbum from "../../types/album";
import { getAlbumsByArtistKey } from "../../api/getAlbum";
import { InfoPageTitle, InfoSection, InfoSectionTitle } from "../../styles/infoPage";
import List from "../../components/common/list";
import AlbumPreview from "../../components/album/albumPreview";
import SongPreview from "../../components/song/songPreview";
import formatTransactionText from "../../utils/formatTransactionText";

export default function Artist(){
    const {id} = useParams();
    const [artist, setArtist] = useState<IArtist>();
    const [songList, setSongList] = useState<ISong[]>();
    const [albumList, setAlbumList] = useState<IAlbum[]>();
    const [transactionText, setTransactionText] = useState('');

    async function fetchArtist(id: string) {
        const artistAsset = await getArtistByKey(id);
        setArtist(artistAsset);
        const albumListAsset = await getAlbumsByArtistKey(id);
        setAlbumList(albumListAsset);
        const songListAsset = await getSongsByArtistKey(id);
        setSongList(songListAsset);
        const newTransactionText = formatTransactionText(artistAsset.lastTouch.transactionType, artistAsset.lastTouch.byWho, artistAsset.lastTouch.timestamp);
        setTransactionText(newTransactionText);
    }

    useEffect(() => {
        if(id) fetchArtist(id);
    }, [id])

    return <>
            <InfoPageTitle>{artist?.name || 'Artist Name'}</InfoPageTitle>
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