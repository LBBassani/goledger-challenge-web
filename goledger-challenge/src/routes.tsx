import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Artist from "./pages/artist";
import Song from "./pages/song";
import Album from "./pages/album";
import ArtistList from "./pages/artistList";
import AlbumList from "./pages/albumList";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "/artist",
          element: <ArtistList/>,
          index: true
        },
        {
          path: "/song",
          element: <Song/>
        },
        {
          path: "/album",
          element: <AlbumList/>
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
        }

      ]
    },
]);

export default router;