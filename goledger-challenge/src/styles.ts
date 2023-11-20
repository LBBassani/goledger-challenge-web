import styled from "styled-components";

export const AppHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: dimgrey;
    padding: 0 16px;
    color: white;
`

export const AppLogo = styled.h1`
    font-size: 32px;
`

export const AppWrapper = styled.div`
    padding: 0 16px;
    flex: auto;
    overflow: auto;
`

export const Button = styled.button<{variant : 'primary' | 'secondary'}>`
    background-color: ${({variant}) => variant === 'primary' ? 'dimgrey' : 'white' };
    color: ${({variant}) => variant === 'primary' ? 'white' :'dimgrey'};
    cursor: pointer;
    padding: 8px;
    border: ${({variant}) => variant === 'primary' ? 'none' : '1px solid dimgray'};
    border-radius: 8px;
    box-shadow: 1px 2px 2px #00000026;
    transition: 0.1s linear;

    &:hover {
        box-shadow: 2px 4px 4px #00000054;
    }
`

export const ActionButtonWrapper = styled.button`
    cursor: pointer;
    padding: 8px;
`

export const StyledLabel = styled.label`
    display: block;

`