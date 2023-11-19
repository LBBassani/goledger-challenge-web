import { StyledLabel } from "../../../styles"
import { SelectWrapper, StyledOption, StyledSelect } from "./styles"

type DropDownProps = {
    name: string
    label: string
    options: Array<{label: string, value: string}>
    value: string,
    onChange: (value: string) => void
}
export default function DropDown({name, label, options, onChange, value}: DropDownProps){
    return <SelectWrapper>
        <StyledLabel htmlFor={name}>{label}</StyledLabel>
        <StyledSelect value={value} id={name} onChange={(event) => {onChange(event.target.value)}}>
            <StyledOption>Select Option</StyledOption>
            {
                options.map((option) => {
                    return <StyledOption key={option.value} value={option.value}>{option.label}</StyledOption>
                })
            }
        </StyledSelect>
    </SelectWrapper>
}