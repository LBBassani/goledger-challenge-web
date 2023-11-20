import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Artist from "./pages/artist";
import Song from "./pages/song";
import Album from "./pages/album";
import ArtistList from "./pages/artistList";
import AlbumList from "./pages/albumList";
import SongList from "./pages/songList";
import PlaylistList from "./pages/playlistList";
import Playlist from "./pages/playlist";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          index: true,
          element: <Navigate to='/artist'/>
        },
        {
          path: "/artist",
          element: <ArtistList/>,
        },
        {
          path: "/song",
          element: <SongList/>
        },
        {
          path: "/album",
          element: <AlbumList/>
        },
        {
          path: "/playlist",
          element: <PlaylistList/>
        },
        {
          path: "/artist/:id",
          element: <Artist/>,
        },
        {
          path: "/song/:id",
          element: <Song/>
        },
        {
          path: "/album/:id",
          element: <Album/>
        },
        {
          path: "/playlist/:id",
          element: <Playlist/>
        },

      ]
    },
]);

export default router;