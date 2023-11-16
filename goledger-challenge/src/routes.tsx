import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Artist from "./pages/artist";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "/artist/:id",
      element: <Artist/>,
    }
]);

export default router;