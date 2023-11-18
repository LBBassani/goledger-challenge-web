import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBarWrapper, SearchInput, SearchInputWrapper } from "./styles";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ActionButtonWrapper } from "../../../styles";

export default function SearchBar(){
    return <SearchBarWrapper>
        <SearchInputWrapper>
            <SearchInput/>
            <ActionButtonWrapper>
                <FontAwesomeIcon color="darkgray" icon={faSearch}/>
            </ActionButtonWrapper>
        </SearchInputWrapper>
    </SearchBarWrapper>
}