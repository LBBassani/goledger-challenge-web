import axios from "axios";
import IAlbum from "../types/album";
import { getArtistBriefByKey } from "./getArtist";

/* Returns brief of album by indicated id/key */
export async function getAlbumBriefByKey(id:string) : Promise<IAlbum> {
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAsset`;
    const response = await axios.post(endpoint, query);

    const albumAsset = response.data;
    const artist = await getArtistBriefByKey(albumAsset.artist['@key']);
    return {
        artist: artist,
        rating: albumAsset.rating,
        title: albumAsset.title,
        releaseDate: albumAsset.releaseDate,
        assetType: albumAsset['@assetType'],
        key: albumAsset['@key'],
        lastTouch: {
            byWho: albumAsset['@lastTouchBy'],
            transactionType: albumAsset['@lastTx']
        }
    }
}

export async function getAlbumsByArtistKey(id: string) : Promise<Array<IAlbum>> {
    const query = {
        query: {
            selector: {
                '@assetType': 'album',
                artist : {
                    '@key' : id 
                }
            }
        }
    };

    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/search`;
    const response = await axios.post(endpoint, query);

    const albumAssetList = response.data.result;
    const albumList : Array<IAlbum> = await Promise.all(albumAssetList.map(async (albumAsset: { [x: string]: any; artist: { [x: string]: string; }; rating: any; releaseDate: any; title: any; }) : Promise<IAlbum> => {
        return {
            assetType: albumAsset['@assetType'],
            key: albumAsset['@key'],
            rating: albumAsset.rating,
            releaseDate: albumAsset.releaseDate,
            title: albumAsset.title,
            lastTouch: {
                byWho: albumAsset['@lastTouchBy'],
                transactionType: albumAsset['@lastTx']
            }
        }
    }))
    
    return albumList;
}