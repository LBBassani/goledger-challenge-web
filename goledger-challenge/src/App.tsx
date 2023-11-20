import { createContext, useState } from 'react'
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/common/navigationBar';
import { AppHeader, AppLogo, AppContentWrapper, AppWrapper } from './styles';
import SearchBar from './components/common/searchBar';
import { SnackbarProvider } from 'notistack';

export const SearchContext = createContext({
    searchString: '', 
    setSearchString: (_searchString: string) => {},
    showSearchBar: true,
    setShowSearchBar: (_showSearchBar: boolean) => {}
});

function App() {

    const [searchString, setSearchString] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(true);

  return (
    <AppWrapper>
        <SnackbarProvider />
        <SearchContext.Provider value={{
            searchString, 
            setSearchString,
            showSearchBar,
            setShowSearchBar
        }}>
            <header>
            <AppHeader>
                <AppLogo>GoMusic</AppLogo>
                <NavigationBar/>
            </AppHeader>
            {showSearchBar && <SearchBar/>}
            </header>
            <AppContentWrapper>
            <Outlet/>
            </AppContentWrapper>
        </SearchContext.Provider>
    </AppWrapper>
  )
}

export default App
