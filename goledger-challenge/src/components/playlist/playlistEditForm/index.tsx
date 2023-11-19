import { useEffect, useState } from "react"
import CheckList from "../../common/checkList"
import TextInput from "../../common/textInput"
import { searchSongs } from "../../../api/songApi/getSong"

type PlaylistEditFormProps = {
    descriptionValue: string,
    descriptionOnChange: (value: string) => void,
    songValues : Array<string>,
    songValuesOnChange: (values: Array<string>) => void
}

export default function PlaylistEditForm({descriptionValue, descriptionOnChange, songValues, songValuesOnChange} : PlaylistEditFormProps) {
    
    const [songOptions, setSongOptions] = useState<Array<{label: string, value: string}>>([{label: 'Loading', value: 'null-song'}]);

    async function getSongOptions() {
        const songListAsset = await searchSongs('');
        const newSongOptions = songListAsset.map((songAsset) => {
            return {label: songAsset.title, value: songAsset.key}
        })
        setSongOptions(newSongOptions);
    }

    useEffect(() => {
        getSongOptions()
    }, [])
    
    return <>
        <TextInput name='description' type='textarea' label='Description' value={descriptionValue} onChange={descriptionOnChange}/>
        <CheckList label='Songs' options={songOptions} values={songValues} changeValues={songValuesOnChange}></CheckList>
    </>
}