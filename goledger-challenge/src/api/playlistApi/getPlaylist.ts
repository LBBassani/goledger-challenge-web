import axios from "axios";
import IPlaylist from "../../types/playlist";
import { getSongBriefByKey } from "../songApi/getSong";

/* Search playlists */
export async function searchPlaylist(search: string, bookmark?: string) : Promise<{playlistList: Array<IPlaylist>, bookmark?: string}>{
    const query = {
        query: {
            selector: {
                '@assetType': 'playlist',
                ...(search && {name: {
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
                '@assetType': 'playlist',
                ...(search && {name: {
                    '$regex' : `(.*)${search}(.*)`
                }})
            },
            limit: 12,
            ...(newBookmark && {bookmark: newBookmark})
        }
    };
    const nextResponse = await axios.post(endpoint, nextQuery);
    const hasNext = nextResponse.data.result.length > 0;

    const playlistAssetList = response.data.result;
    const playlistList : Array<IPlaylist> = await Promise.all((playlistAssetList.map(async (playlistAsset: { [x: string]: any; name: any; description: any; songs: string | any[]; }) : Promise<IPlaylist>=> {
        return{
            key: playlistAsset['@key'],
            assetType: playlistAsset['@assetType'],
            name: playlistAsset.name,
            description: playlistAsset.description,
            size: playlistAsset.songs?.length || 0,
            lastTouch: {
                byWho: playlistAsset['@lastTouchBy'],
                transactionType: playlistAsset['@lastTx']
            } 
        }
    })))

    return {
        playlistList,
        ...(hasNext && newBookmark && { bookmark: newBookmark})
    };
}

/* Returns the complete data of the playlist indicated by id/key */
export async function getPlaylistByKey(id:string) : Promise<IPlaylist> {
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAssetHistory`;
    const response = await axios.post(endpoint, query);

    const playlistHistory = response.data;
    const playlistAsset = playlistHistory[0];

    const songList = await Promise.all(playlistAsset.songs?.map((song: { [x: string]: string; }) => {
        return getSongBriefByKey(song['@key']);
    }) || [])

    return {
        key: playlistAsset['@key'],
        assetType: playlistAsset['@assetType'],
        name: playlistAsset.name,
        description: playlistAsset.description,
        size: songList.length,
        songs: songList,
        lastTouch: {
            byWho: playlistAsset['@lastTouchBy'],
            transactionType: playlistAsset['@lastTx'],
            isDeleted: playlistAsset['_isDelete'],
            timestamp: playlistAsset['_timestamp'],
            transactionId: playlistAsset['_txId']
        }
    }
}

export async function getPlaylistsBySongKey(id: string): Promise<Array<IPlaylist>>{
    const query = {
        query: {
            selector: {
                '@assetType': 'playlist',
                songs : {
                    '$elemMatch' : {
                        '@key' : id 
                    }
                }
            }
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/search`;
    const response = await axios.post(endpoint, query);

    const playlistAssetList = response.data.result;
    const playlistList : Array<IPlaylist> = await Promise.all((playlistAssetList.map(async (playlistAsset: { [x: string]: any; name: any; description: any; songs: string | any[]; }) : Promise<IPlaylist>=> {
        return{
            key: playlistAsset['@key'],
            assetType: playlistAsset['@assetType'],
            name: playlistAsset.name,
            description: playlistAsset.description,
            size: playlistAsset.songs?.length || 0,
            lastTouch: {
                byWho: playlistAsset['@lastTouchBy'],
                transactionType: playlistAsset['@lastTx']
            } 
        }
    })))

    return playlistList;

}