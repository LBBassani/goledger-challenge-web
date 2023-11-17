import { useEffect, useState } from 'react'
import './App.css'
import IArtist from './types/artist';
import IAlbum from './types/album';
import ISong from './types/song';
import { searchAlbums } from './api/getAlbum';
import { searchArtists } from './api/getArtist';
import { searchSongs } from './api/getSong';
import List from './components/common/list';
import ArtistPreview from './components/artist/artistPreview';
import AlbumPreview from './components/album/albumPreview';
import SongPreview from './components/song/songPreview';

function App() {

  const [artistList, setArtistList] = useState<Array<IArtist>>();
  const [albumList, setAlbumList] = useState<Array<IAlbum>>();
  const [songList, setSongList] = useState<Array<ISong>>();
  const [searchString, setSearchString] = useState('');

  async function fetchArtists(search : string) {
    const artists = await searchArtists(search);
    setArtistList(artists);
  }

  async function fetchAlbums(search : string) {
    const albums = await searchAlbums(search);
    setAlbumList(albums);
  }

  async function fetchSongs(search : string) {
    const songs = await searchSongs(search);
    setSongList(songs);
  }

  useEffect(() => {
    fetchArtists(searchString);
    fetchAlbums(searchString);
    fetchSongs(searchString);
  },[searchString])
  
  return (
    <>
      <h1>GoMusic</h1>
      <h2>Artists</h2>
      <List>{artistList?.map((artist) => {
        return <ArtistPreview artist={artist} key={artist.key}/>
      })}</List>
      <h2>Albums</h2>
      <List>
        {albumList?.map((album) => {
          return <AlbumPreview album={album} key={album.key}/>
        })}
      </List>
      <h2>Songs</h2>
      <List>
        {songList?.map((song) => {
          return <SongPreview song={song} key={song.key}/>
        })}
      </List>
      <h2>Playlists</h2>
    </>
  )
}

export default App
