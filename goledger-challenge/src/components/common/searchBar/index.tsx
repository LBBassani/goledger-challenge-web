import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBarWrapper, SearchButton, SearchInput, SearchInputWrapper } from "./styles";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar(){
    return <SearchBarWrapper>
        <SearchInputWrapper>
            <SearchInput/>
            <SearchButton>
                <FontAwesomeIcon color="darkgray" icon={faSearch}/>
            </SearchButton>
        </SearchInputWrapper>
    </SearchBarWrapper>
}