import TextInput from "../../common/textInput";

type ArtistEditFormProps = {
    aboutValue : string;
    aboutOnChange : (value: string) => void;
}

export default function ArtistEditForm({aboutValue, aboutOnChange} : ArtistEditFormProps){

    return <TextInput name='about' type='textarea' label='About' value={aboutValue} onChange={aboutOnChange}></TextInput>
}