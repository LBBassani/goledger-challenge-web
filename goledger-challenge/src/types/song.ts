import IAlbum from "./album";
import IArtist from "./artist";
import BlockChainAsset from "./blockChainAsset";

/* Interface of Song type */
export default interface ISong extends BlockChainAsset {
    title : string,
    explicit : boolean,
    artists? : Array<IArtist>,
    album? : IAlbum
    albumName?: string
}