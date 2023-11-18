import { useEffect, useState } from "react"
import IAlbum from "../../types/album"
import { searchAlbums } from "../../api/getAlbum";
import List from "../../components/common/list";
import AlbumPreview from "../../components/album/albumPreview";
import { enqueueSnackbar } from "notistack";

export default function AlbumList(){
    const [albumList, setAlbumList] = useState<Array<IAlbum>>();
    
    async function fetchAlbums(search : string) {
        const albums = await searchAlbums(search);
        setAlbumList(albums);
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
      }
  
      useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});  
        fetchAlbums('');
    },[])

    return <>
    <h2>Albums</h2>
      <List>
        {albumList?.map((album) => {
          return <AlbumPreview album={album} key={album.key}/>
        })}
      </List>
    </>
}