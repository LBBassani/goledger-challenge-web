import { Link } from "react-router-dom";
import { NavBar } from "./styles";

export default function NavigationBar(){
    return <NavBar>
        <Link to={'/artist/'}>Artists</Link>
        <Link to={'/song/'}>Songs</Link>
        <Link to={'/album/'}>Albums</Link>
        <Link to={'/playlist/'}>Playlists</Link>
    </NavBar>
}