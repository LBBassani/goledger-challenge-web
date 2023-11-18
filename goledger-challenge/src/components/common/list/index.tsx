import { ListWrapper } from "./styles";

export default function List({children} : {children?: JSX.Element[]}){
    return <ListWrapper>
        {children}
    </ListWrapper>
}