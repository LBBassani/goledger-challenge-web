import { StyledInput, StyledLabel, StyledTextArea, TextInputWrapper } from "./styles";

type TextInputProps = {
    name: string
    type: string
    label: string
    value: string
    onChange: (value: string) => void
}

export default function TextInput({name, type, label, value, onChange} : TextInputProps){
    return <TextInputWrapper>
        <StyledLabel htmlFor={name}>{label}</StyledLabel>
        {
            type === 'textarea' ?
            <StyledTextArea id={name} value={value} onChange={(event) => {onChange(String(event.target.value))}}/> :
            <StyledInput type={type} id={name} value={value} onChange={(event) => {onChange(String(event.target.value))}}/>
        }
    </TextInputWrapper> 
}