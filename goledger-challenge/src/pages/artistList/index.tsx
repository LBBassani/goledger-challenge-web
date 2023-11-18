import { useEffect, useState } from "react";
import { searchArtists } from "../../api/getArtist";
import List from "../../components/common/list";
import ArtistPreview from "../../components/artist/artistPreview";
import IArtist from "../../types/artist";
import { enqueueSnackbar } from "notistack";

export default function ArtistList(){
    const [artistList, setArtistList] = useState<Array<IArtist>>();
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
      <h2>Artists</h2>
      <List>{artistList?.map((artist) => {
        return <ArtistPreview artist={artist} key={artist.key}/>
      })}</List>
      </>
}