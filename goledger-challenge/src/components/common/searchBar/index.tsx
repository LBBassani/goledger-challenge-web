import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBarWrapper, SearchInput, SearchInputWrapper } from "./styles";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ActionButtonWrapper } from "../../../styles";
import { useContext, useState } from "react";
import { SearchContext } from "../../../App";

export default function SearchBar(){
    const {searchString, setSearchString} = useContext(SearchContext);
    const [searchValue, setSearchValue] = useState(searchString);
    
    return <SearchBarWrapper>
        <SearchInputWrapper>
            <SearchInput 
                value={searchValue} 
                onChange={(event) => {setSearchValue(event.target.value)}} 
                onKeyDown={(event) => {if(event.key === 'Enter') setSearchString(searchValue)}}
            />
            <ActionButtonWrapper onClick={() => {setSearchString(searchValue)}}>
                <FontAwesomeIcon color="darkgray" icon={faSearch}/>
            </ActionButtonWrapper>
        </SearchInputWrapper>
    </SearchBarWrapper>
}