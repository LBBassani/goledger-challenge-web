import { StyledLabel } from "../../../styles";
import { StyledCheckBox, StyledCheckListArea, StyledCheckListWrapper } from "./styles";

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
                    return <StyledLabel>
                        <StyledCheckBox 
                            type="checkbox" 
                            value={option.value}
                            key={option.value}
                            onChange={(event) => {
                                handleValues(option.value, event.target.checked);
                            }}
                            checked={values.includes(option.value)}
                        >
                        </StyledCheckBox>
                        {option.label}
                    </StyledLabel>
                })
            }
        </StyledCheckListArea>
    </StyledCheckListWrapper>
}