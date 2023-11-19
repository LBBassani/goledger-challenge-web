import { useEffect, useState } from "react";
import { searchArtists } from "../../api/artistApi/getArtist";
import List from "../../components/common/list";
import ArtistPreview from "../../components/artist/artistPreview";
import IArtist from "../../types/artist";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import ArtistCreateForm from "../../components/artist/artistCreateForm";

export default function ArtistList(){
    const [artistList, setArtistList] = useState<Array<IArtist>>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    async function fetchArtists(search : string) {
        const artists = await searchArtists(search);
        setArtistList(artists);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }
  
    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});  
        fetchArtists('');
    },[])

    return <>
        {
            showCreateModal &&
            <ArtistCreateForm onClose={() => setShowCreateModal(false)} />
        }
        <InfoPageHeader 
            title="Artists"
            onCreate={() => {setShowCreateModal(true)}} 
        />
        <List>
            {artistList?.map((artist) => {
                return <ArtistPreview artist={artist} key={artist.key}/>
            })}
        </List>
    </>
}