import styled from "styled-components";

export const StyledInput = styled.input`
    background-color: transparent;
    border: 1px solid dimgray;
    border-radius: 8px;
    box-shadow: 1px 2px 2px #00000026;
    padding: 8px;
    width: 100%;
`

export const StyledTextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 8px;
    border: 1px solid dimgray;
    border-radius: 8px;
    box-shadow: 1px 2px 2px #00000026;
`

export const TextInputWrapper = styled.div<{type : string}>`
    margin-bottom: 12px;
    display: flex;
    flex-direction: ${({type}) => type === 'checkbox' ? 'row-reverse' : 'column'};
    justify-content: left;
    gap: 4px;
    align-items: ${({type}) => type === 'checkbox' ? 'center' : 'left'};
`

export const StyledCheckbox = styled.input`
    background-color: transparent;
    border: 1px solid dimgray;
    border-radius: 8px;
    box-shadow: 1px 2px 2px #00000026;
    height: 16px;
    width: 16px;
`