import { useContext, useEffect, useState } from "react"
import IAlbum from "../../types/album"
import { searchAlbums } from "../../api/albumApi/getAlbum";
import List from "../../components/common/list";
import AlbumPreview from "../../components/album/albumPreview";
import { enqueueSnackbar } from "notistack";
import { InfoPageHeader } from "../../components/common/infoPage";
import AlbumCreateForm from "../../components/album/albumCreateForm";
import { InfoSection } from "../../components/common/infoPage/styles";
import { SearchContext } from "../../App";
import { Button } from "../../styles";

export default function AlbumList(){
    const [albumList, setAlbumList] = useState<Array<IAlbum>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nextPageBookmark, setBookmark] = useState('');
    const {searchString, setShowSearchBar} = useContext(SearchContext);

    async function fetchAlbums(search : string, bookmark?: string) {
        const {albumList: albums, bookmark: newBookmark} = await searchAlbums(search, bookmark);
        setAlbumList([...albumList,...albums]);
        setBookmark(newBookmark || '');
        enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }
  
    useEffect(()=> {
        enqueueSnackbar({message: 'Loading...', variant: 'info'});  
        setAlbumList([]);
        fetchAlbums(searchString);
    },[searchString])

    useEffect(() => {
        setShowSearchBar(true);
    }, [])

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
        <InfoSection>
            {
                nextPageBookmark &&
                <Button variant="primary" onClick={() =>{ 
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    fetchAlbums(searchString, nextPageBookmark);
                }}>Load More Albums</Button>
            }
        </InfoSection>
    </>
}