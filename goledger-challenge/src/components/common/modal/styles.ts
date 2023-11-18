import styled from "styled-components";

export const Overlay = styled.div`
    background-color: rgb(0 0 0 / 51%);
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
`

export const ModalWrapper = styled.div`
    background-color: white;
    width: 50%;
    min-height: 300px;
    min-width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 12px;
    box-shadow: 4px 8px 4px #00000026;
    padding: 16px;
    display: flex;
    flex-direction: column;
`

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
`

export const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    gap: 12px;
`
export const ModalContent = styled.div`
    flex: auto;
`
export const ModalTitle = styled.h3`
    
`