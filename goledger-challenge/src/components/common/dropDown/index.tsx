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
        <StyledSelect id={name} onChange={(event) => {onChange(event.target.value)}}>
            {
                options.map((option) => {
                    return <StyledOption selected={option.value === value} key={option.value} value={option.value}>{option.label}</StyledOption>
                })
            }
        </StyledSelect>
    </SelectWrapper>
}