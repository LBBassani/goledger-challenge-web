import { useEffect, useState } from "react"
import CheckList from "../../common/checkList"
import TextInput from "../../common/textInput"
import { searchSongs } from "../../../api/songApi/getSong"
import { Button } from "../../../styles"
import { enqueueSnackbar } from "notistack"

type PlaylistEditFormProps = {
    descriptionValue: string,
    descriptionOnChange: (value: string) => void,
    songValues : Array<string>,
    songValuesOnChange: (values: Array<string>) => void
}

export default function PlaylistEditForm({descriptionValue, descriptionOnChange, songValues, songValuesOnChange} : PlaylistEditFormProps) {
    
    const [songOptions, setSongOptions] = useState<Array<{label: string, value: string}>>([{label: 'Loading', value: 'null-song'}]);
    const [songOptionsBookmark, setSongOptionsBookmark] = useState('');
    
    async function getSongOptions(oldSongOptions: Array<{label: string, value: string}>, bookmark?: string) {
        const {songList: songListAsset, bookmark: newBookmark} = await searchSongs('', bookmark);
        setSongOptionsBookmark(newBookmark || '')
        const newSongOptions = songListAsset.map((songAsset) => {
            return {label: songAsset.title, value: songAsset.key}
        })
        setSongOptions([...oldSongOptions, ...newSongOptions]);
        if(bookmark) enqueueSnackbar({message: 'Data loaded successfully', variant: 'success'});
    }

    useEffect(() => {
        getSongOptions([]);
    }, [])
    
    return <>
        <TextInput name='description' type='textarea' label='Description' value={descriptionValue} onChange={descriptionOnChange}/>
        <CheckList label='Songs' options={songOptions} values={songValues} changeValues={songValuesOnChange}></CheckList>
        <>
            {
                songOptionsBookmark && 
                <Button variant="primary" onClick={() => {
                    enqueueSnackbar({message: 'Loading...', variant: 'info'});
                    getSongOptions(songOptions, songOptionsBookmark);
                }}>
                    Load More Songs
                </Button>
            }
        </>
    </>
}