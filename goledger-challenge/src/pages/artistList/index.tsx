import { useContext, useEffect, useState } from "react";
import { searchArtists } from "../../api/artistApi/getArtist";
import List from "../../components/common/list";
import ArtistPreview from "../../components/artist/artistPreview";
import IArtist from "../../types/artist";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import ArtistCreateForm from "../../components/artist/artistCreateForm";
import { InfoSection } from "../../components/common/infoPage/styles";
import { SearchContext } from "../../App";

export default function ArtistList(){
    const [artistList, setArtistList] = useState<Array<IArtist>>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchArtists(search : string) {
        const artists = await searchArtists(search);
        setArtistList(artists);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }
  
    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});  
        fetchArtists(searchString);
    },[searchString])

    useEffect(() => {
        setShowSearchBar(true);
    }, [])

    return <>
        {
            showCreateModal &&
            <ArtistCreateForm onClose={() => setShowCreateModal(false)} />
        }
        <InfoPageHeader 
            title="Artists"
            onCreate={() => {setShowCreateModal(true)}} 
        />
        <InfoSection>
            <List>
                {artistList?.map((artist) => {
                    return <ArtistPreview artist={artist} key={artist.key}/>
                })}
            </List>
        </InfoSection>
    </>
}