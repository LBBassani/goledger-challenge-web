import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionButtonWrapper } from "../../../styles";
import { InfoPageHeaderActionWrapper, InfoPageHeaderWrapper, InfoPageSubtitle, InfoPageTitle, InfoPageTitleWrapper } from "./styles";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

type InfoPageHeaderProps = {
    title: string
    subtitle?: string
    onEdit?: () => void
    onDelete?: () => void
    onCreate?: () => void
}
export function InfoPageHeader({title, subtitle, onEdit, onDelete, onCreate} : InfoPageHeaderProps){

    return <InfoPageHeaderWrapper>
        <InfoPageTitleWrapper>
            <InfoPageTitle>{title}</InfoPageTitle>
            {
                subtitle &&
                <InfoPageSubtitle>{subtitle}</InfoPageSubtitle>
            }
        </InfoPageTitleWrapper>
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
            {
                onCreate &&
                <ActionButtonWrapper onClick={onCreate}>
                    <FontAwesomeIcon icon={faPlus} />
                </ActionButtonWrapper>
            }
        </InfoPageHeaderActionWrapper>
    </InfoPageHeaderWrapper>
}