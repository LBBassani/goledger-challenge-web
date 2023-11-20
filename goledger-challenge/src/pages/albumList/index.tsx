import { useEffect, useState } from "react"
import IAlbum from "../../types/album"
import { searchAlbums } from "../../api/albumApi/getAlbum";
import List from "../../components/common/list";
import AlbumPreview from "../../components/album/albumPreview";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import AlbumCreateForm from "../../components/album/albumCreateForm";
import { InfoSection } from "../../components/common/infoPage/styles";

export default function AlbumList(){
    const [albumList, setAlbumList] = useState<Array<IAlbum>>();
    const [showCreateModal, setShowCreateModal] = useState(false);

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
        {
            showCreateModal &&
            <AlbumCreateForm
                onClose={() => {setShowCreateModal(false)}}
            />
        }
        <InfoPageHeader 
            title="Albums"
            onCreate={() => {setShowCreateModal(true)}}
        />
        <InfoSection>
            <List>
                {albumList?.map((album) => {
                return <AlbumPreview album={album} key={album.key}/>
                })}
            </List>
        </InfoSection>
    </>
}