import { useContext, useEffect, useState } from "react";
import { searchArtists } from "../../api/artistApi/getArtist";
import List from "../../components/common/list";
import ArtistPreview from "../../components/artist/artistPreview";
import IArtist from "../../types/artist";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import ArtistCreateForm from "../../components/artist/artistCreateForm";
import { EmptyStateText, InfoSection } from "../../components/common/infoPage/styles";
import { SearchContext } from "../../App";
import { Button } from "../../styles";

export default function ArtistList(){
    const [artistList, setArtistList] = useState<Array<IArtist>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nextPageBookmark, setBookmark] = useState('');
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchArtists(oldList: Array<IArtist>,search : string, bookmark?: string) {
        const {artistList: artists, bookmark: newBookmark} = await searchArtists(search, bookmark);
        setArtistList([...oldList,...artists]);
        setBookmark(newBookmark || '');
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }
  
    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});  
        fetchArtists([], searchString);
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
            {
                artistList && artistList.length > 0 ?
                <List>
                    {artistList.map((artist) => {
                        return <ArtistPreview artist={artist} key={artist.key}/>
                    })}
                </List>
                :
                <EmptyStateText>There is nothing to see here</EmptyStateText>
            }
        </InfoSection>
        <InfoSection>
            {
                nextPageBookmark &&
                <Button variant="primary" onClick={() => {
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    fetchArtists(artistList, searchString, nextPageBookmark)
                }}>Load More Artists</Button>
            }
        </InfoSection>
    </>
}