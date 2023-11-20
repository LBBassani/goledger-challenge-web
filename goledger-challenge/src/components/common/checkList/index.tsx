import { StyledLabel } from "../../../styles";
import TextInput from "../textInput";
import { StyledCheckListArea, StyledCheckListWrapper } from "./styles";

type CheckListProps = {
    label: string
    options: Array<{label: string, value: string}>
    values: Array<string>
    changeValues: (values: Array<string>) => void
}

export default function CheckList({label, options, values, changeValues} : CheckListProps){
    function handleValues(value: string, checked: boolean){
        if(checked){
            changeValues([...values, value]);
        } else {
            changeValues(values.filter((val) => val !== value));
        }
    }
    
    return <StyledCheckListWrapper>
        <StyledLabel>{label}</StyledLabel>
        <StyledCheckListArea>
            {
                options.map((option) => {
                    return <TextInput 
                            key={option.value}
                            type="checkbox" 
                            value={String(values.includes(option.value))}
                            onChange={(value) => {
                                handleValues(option.value, value === 'true');
                            }}
                            label={option.label}
                            name={option.value}
                        />
                })
            }
        </StyledCheckListArea>
    </StyledCheckListWrapper>
}