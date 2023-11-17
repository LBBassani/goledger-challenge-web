import IArtist from "./artist";
import BlockChainAsset from "./blockChainAsset";

/* Interface of album type */
export default interface IAlbum extends BlockChainAsset{
    title: string,
    rating: number,
    releaseDate: string,
    artist: IArtist
}