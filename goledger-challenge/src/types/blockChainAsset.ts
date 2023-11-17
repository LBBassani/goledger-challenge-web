/* Interface of an asset in blockchain */
export default interface BlockChainAsset {
    assetType : string,
    key : string,
    lastTouch : {
        transactionType : string,
        transactionId? : string,
        byWho : string,
        isDeleted? : boolean,
        timestamp? : string
    }

}