import BlockChainAsset from "./blockChainAsset";

/* Interface of artist type */
export default interface IArtist extends BlockChainAsset{
    name: string,
    about: string
}