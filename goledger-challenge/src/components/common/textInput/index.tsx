import { StyledLabel } from "../../../styles";
import { StyledInput, StyledTextArea, TextInputWrapper } from "./styles";

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
            type === 'checkbox' ?
            <input type={type} id={name} value={name} checked={value !== 'false'} onChange={(event) => {onChange(String(event.target.checked))}}/> :
            <StyledInput type={type} id={name} value={value} onChange={(event) => {onChange(String(event.target.value))}}/>
        }
    </TextInputWrapper> 
}