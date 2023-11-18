import BlockChainAsset from "./blockChainAsset";
import ISong from "./song";

export default interface IPlaylist extends BlockChainAsset{
    name: string
    description: string
    songs?: Array<ISong>
    size: number
}