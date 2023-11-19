import TextInput from "../../common/textInput"

type AlbumEditFormProps = {
    ratingValue: string
    ratingOnChange: (value: string) => void
    releaseDateValue: string
    releaseDateOnChange: (value: string) => void
}

export default function AlbumEditForm({ratingValue, ratingOnChange, releaseDateValue, releaseDateOnChange} : AlbumEditFormProps){

    return <>
        <TextInput type="number" label="Rating" name="rating" value={ratingValue} onChange={ratingOnChange}/>
        <TextInput type="date" label="Release Date" name="releaseDate" value={releaseDateValue} onChange={releaseDateOnChange}/>
    </>

}