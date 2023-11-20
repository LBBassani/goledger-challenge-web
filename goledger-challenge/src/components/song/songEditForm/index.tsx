import { useEffect, useState } from "react"
import DropDown from "../../common/dropDown"
import TextInput from "../../common/textInput"
import { searchAlbums } from "../../../api/albumApi/getAlbum"
import { enqueueSnackbar } from "notistack"
import { Button } from "../../../styles"

type SongEditFormProps = {
    explicitValue: boolean
    explicitOnChange: (value: string) => void
    albumValue?: string
    albumOnChange?: ( value : string) => void
}

export default function SongEditForm({explicitValue, explicitOnChange, albumValue, albumOnChange} : SongEditFormProps){
    const [albumOptions, setAlbumOptions] = useState<Array<{label: string, value: string}>>([{label: 'Aguarde', value: 'null-album'}]);
    const [albumOptionsBookmark, setAlbumOptionsBookmark] = useState('');

    async function getAlbumOptions(oldAlbumOptions:  Array<{label: string, value: string}>, bookmark?: string ) {
        const {albumList, bookmark: newBookmark} = await searchAlbums('', bookmark);
        setAlbumOptionsBookmark(newBookmark || '');
        if(albumList){
            const albumOptionsList = albumList.map((albumOption) => {return {label: albumOption.title, value: albumOption.key}});
            setAlbumOptions([...oldAlbumOptions, ...albumOptionsList]);
        }
    }

    useEffect(() => {
        getAlbumOptions([]);
    }, [])
    
    return <>
        <TextInput name='explicit' type='checkbox' label='Explicit' value={String(explicitValue)} onChange={explicitOnChange} />
        <DropDown name='album' label='Album' value={albumValue || ''} onChange={albumOnChange || (() => {})} options={albumOptions}/>
        <>
            {
                albumOptionsBookmark && 
                <Button variant="primary" onClick={() => {
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    getAlbumOptions(albumOptions, albumOptionsBookmark);
                }}>
                    Load More Albums
                </Button>
            }
        </>
    </> 
}