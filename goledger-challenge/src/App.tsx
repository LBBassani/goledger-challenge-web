import { useEffect, useState } from 'react'
import ISong from './types/song';
import { searchSongs } from './api/getSong';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/common/navigationBar';
import { AppHeader, AppLogo } from './styles';
import SearchBar from './components/common/searchBar';

function App() {

  const [songList, setSongList] = useState<Array<ISong>>();
  const [searchString, setSearchString] = useState('');

  async function fetchSongs(search : string) {
    const songs = await searchSongs(search);
    setSongList(songs);
  }

  useEffect(() => {
    fetchSongs(searchString);
  },[searchString])
  
  return (
    <>
     <header>
      <AppHeader>
        <AppLogo>GoMusic</AppLogo>
        <NavigationBar/>
      </AppHeader>
      <SearchBar/>
     </header>
      <Outlet/>
      
      {/* 
      <h2>Songs</h2>
      <List>
        {songList?.map((song) => {
          return <SongPreview song={song} key={song.key}/>
        })}
      </List>
      <h2>Playlists</h2> */}
    </>
  )
}

export default App
