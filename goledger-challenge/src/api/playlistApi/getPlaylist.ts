import axios from "axios";
import IPlaylist from "../../types/playlist";
import { getSongBriefByKey } from "../songApi/getSong";

/* Search playlists */
export async function searchPlaylist(search: string) : Promise<Array<IPlaylist>>{
    const query = {
        query: {
            selector: {
                '@assetType': 'playlist'
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

    const songList = await Promise.all(playlistAsset.songs.map((song: { [x: string]: string; }) => {
        return getSongBriefByKey(song['@key']);
    }))

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