import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionButtonWrapper } from "../../../styles";
import { InfoPageHeaderActionWrapper, InfoPageHeaderWrapper, InfoPageTitle } from "./styles";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

type InfoPageHeaderProps = {
    title: string;
    onEdit?: () => void;
    onDelete?: () => void;
}
export function InfoPageHeader({title, onEdit, onDelete} : InfoPageHeaderProps){

    return <InfoPageHeaderWrapper>
        <InfoPageTitle>{title}</InfoPageTitle>
        <InfoPageHeaderActionWrapper>
            {
                onEdit && 
                <ActionButtonWrapper onClick={onEdit}>
                    <FontAwesomeIcon icon={faPen} />
                </ActionButtonWrapper>
            }
            {
                onDelete &&
                <ActionButtonWrapper onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </ActionButtonWrapper>
            }
        </InfoPageHeaderActionWrapper>
    </InfoPageHeaderWrapper>
}