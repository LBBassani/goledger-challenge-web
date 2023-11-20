import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalWrapper, Overlay } from "./styles";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ActionButtonWrapper, Button } from "../../../styles";

type ModalProps = {
    onClose?: () => void;
    closeText?: string;
    onConfirm?: () => void;
    confirmText?: string;
    title?: string;
    children?: JSX.Element[] | JSX.Element;
}

export default function Modal({children, title, onClose, closeText, onConfirm, confirmText} : ModalProps){
    return <Overlay>
        <ModalWrapper>
            <ModalHeader>
                <ModalTitle>{title}</ModalTitle> 
                <ActionButtonWrapper onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </ActionButtonWrapper>
            </ModalHeader>
            <ModalContent>
                {children}
            </ModalContent>
            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>{closeText || 'Cancel'}</Button>
                <Button variant="primary" onClick={onConfirm}>{confirmText || 'Confirm'}</Button>
            </ModalFooter>
        </ModalWrapper>
    </Overlay>
}