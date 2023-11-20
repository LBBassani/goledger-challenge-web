import axios from "axios";
import IAlbum from "../../types/album";
import { getArtistBriefByKey } from "../artistApi/getArtist";

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

export async function getAlbumNameByKey(id: string) : Promise<string> {
    const query = {
        key: {
            '@key' : id 
        },
        fields: [
            'title'
        ]
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAsset`;
    const response = await axios.post(endpoint, query);

    const albumAsset = response.data;
    return albumAsset.title;
}

/* Returns the complete data of the artist indicated by id/key */
export async function getAlbumByKey(id: string) : Promise<IAlbum> {
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAssetHistory`;
    const response = await axios.post(endpoint, query);

    const albumHistory = response.data;
    const albumAsset = albumHistory[0];

    const artist = await getArtistBriefByKey(albumAsset.artist['@key']);

    return {
        assetType: albumAsset['@assetType'],
        key: albumAsset['@key'],
        rating: albumAsset.rating,
        releaseDate: albumAsset.releaseDate,
        title: albumAsset.title,
        artist: artist,
        lastTouch: {
            byWho: albumAsset['@lastTouchBy'],
            transactionType: albumAsset['@lastTx'],
            isDeleted: albumAsset['_isDelete'],
            timestamp: albumAsset['_timestamp'],
            transactionId: albumAsset['_txId']
        }
    }
    
}

/* Returns all albums by artist indicated by id/key */
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

/* Search albums */
export async function searchAlbums(search:string, bookmark?: string) : Promise<{albumList: Array<IAlbum>, bookmark?: string}> {
    const query = {
        query: {
            selector: {
                '@assetType': 'album',
                ...(search && {title: {
                    '$regex' : `(.*)${search}(.*)`
                }})
            },
            limit: 12,
            ...(bookmark && {bookmark: bookmark})
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/search`;
    const response = await axios.post(endpoint, query);

    const newBookmark = response.data.metadata.bookmark;
    const nextQuery = {
        query: {
            selector: {
                '@assetType': 'album',
                ...(search && {title: {
                    '$regex' : `(.*)${search}(.*)`
                }})
            },
            limit: 12,
            ...(newBookmark && newBookmark !== 'nil' && {bookmark: newBookmark})
        }
    };
    const nextResponse = await axios.post(endpoint, nextQuery);
    const hasNext = nextResponse.data.result.length > 0;

    const albumAssetList = response.data.result;
    const albumList : Array<IAlbum> = await Promise.all(albumAssetList.map(async (albumAsset: { [x: string]: any; artist: { [x: string]: string; }; rating: any; releaseDate: any; title: any; }) : Promise<IAlbum> => {
        const artist = await getArtistBriefByKey(albumAsset.artist['@key']);
        return {
            assetType: albumAsset['@assetType'],
            key: albumAsset['@key'],
            rating: albumAsset.rating,
            releaseDate: albumAsset.releaseDate,
            title: albumAsset.title,
            artist: artist,
            lastTouch: {
                byWho: albumAsset['@lastTouchBy'],
                transactionType: albumAsset['@lastTx']
            }
        }
    }))
    
    return {
        albumList,
        ...(hasNext && newBookmark && { bookmark: newBookmark})
    };
}