import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/common/navigationBar';
import { AppHeader, AppLogo, AppWrapper } from './styles';
import SearchBar from './components/common/searchBar';

function App() {

  const [searchString, setSearchString] = useState('');
  
  return (
    <>
     <header>
      <AppHeader>
        <AppLogo>GoMusic</AppLogo>
        <NavigationBar/>
      </AppHeader>
      <SearchBar/>
     </header>
     <AppWrapper>
      <Outlet/>
     </AppWrapper>
    </>
  )
}

export default App
