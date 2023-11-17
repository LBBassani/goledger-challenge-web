import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Artist from "./pages/artist";
import Song from "./pages/song";
import Album from "./pages/album";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
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
]);

export default router;