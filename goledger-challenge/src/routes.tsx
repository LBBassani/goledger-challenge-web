import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Artist from "./pages/artist";
import Song from "./pages/song";
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
    }
]);

export default router;