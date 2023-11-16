import { useParams } from "react-router-dom";


export default function Artist(){
    const {id} = useParams();
    return <>{id}</>
}