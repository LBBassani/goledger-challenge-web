import axios from "axios";
import ISong from "../../types/song";
import { getAlbumBriefByKey, getAlbumNameByKey } from "../albumApi/getAlbum";
import { getArtistBriefByKey } from "../artistApi/getArtist";
import IArtist from "../../types/artist";

/* Returns the complete data of the song indicated by id/key */
export async function getSongByKey(id: string) : Promise<ISong> {
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAssetHistory`;
    const response = await axios.post(endpoint, query);

    const songHistory = response.data;
    const songAsset = songHistory[0];

    const albumBrief = await getAlbumBriefByKey(songAsset.album['@key']);
    const artists = await Promise.all(songAsset.artists.map((artistAsset: { [x: string]: string; }) : Promise<IArtist> => {
        return getArtistBriefByKey(artistAsset['@key']);
    }))

    return {
        assetType: songAsset['@assetType'],
        key: songAsset['@key'],
        explicit: songAsset.explicit,
        title: songAsset.title,
        album: albumBrief,
        artists: artists,
        lastTouch: {
            byWho: songAsset['@lastTouchBy'],
            transactionType: songAsset['@lastTx'],
            timestamp: songAsset['_timestamp'],
            transactionId: songAsset['_txId'],
            isDeleted: songAsset['_isDelete']
        }
    }
}

/* Returns brief of song by indicated id/key */
export async function getSongBriefByKey(id: string) {
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAsset`;
    const response = await axios.post(endpoint, query);

    const songAsset = response.data;
    const artists = await Promise.all(songAsset.artists.map((artistAsset: { [x: string]: string; }) : Promise<IArtist> => {
        return getArtistBriefByKey(artistAsset['@key']);
    }))
    return {
        key : songAsset['@key'],
        assetType : songAsset['@assetType'],
        title: songAsset.title,
        explicit: songAsset.explicit,
        artists: artists,
        lastTouch: {
            byWho: songAsset['@lastTouchBy'],
            transactionType: songAsset['@lastTx']
        },
    }
    
}

/* Returns the song list of the artist indicated by the id/key */
export async function getSongsByArtistKey(id: string) : Promise<Array<ISong>> {
    const query = {
        query: {
            selector: {
                '@assetType': 'song',
                artists : {
                    '$elemMatch' : {
                        '@key' : id 
                    }
                }
            }
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/search`;
    const response = await axios.post(endpoint, query);

    const songAssetList = response.data.result;
    const songList : Array<ISong> = (songAssetList.map((songAsset: { [x: string]: any; album: { [x: string]: string; }; artist: { [x: string]: string; }[]; title: any; explicit: any; }) : ISong => {
        
        return {
            key : songAsset['@key'],
            assetType : songAsset['@assetType'],
            title: songAsset.title,
            explicit: songAsset.explicit,
            lastTouch: {
                byWho: songAsset['@lastTouchBy'],
                transactionType: songAsset['@lastTx']
            },
        }
    }))
    return songList;
}

/* Returns the song list of the album indicated by the id/key */
export async function getSongsByAlbumKey(id: string) {
    const query = {
        query: {
            selector: {
                '@assetType': 'song',
                'album': {
                    '@key': id
                }
            }
        }
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/search`;
    const response = await axios.post(endpoint, query);

    const songAssetList = response.data.result;
    const songList : Array<ISong> = (songAssetList.map((songAsset: { [x: string]: any; album: { [x: string]: string; }; artist: { [x: string]: string; }[]; title: any; explicit: any; }) : ISong => {
        
        return {
            key : songAsset['@key'],
            assetType : songAsset['@assetType'],
            title: songAsset.title,
            explicit: songAsset.explicit,
            lastTouch: {
                byWho: songAsset['@lastTouchBy'],
                transactionType: songAsset['@lastTx']
            },
        }
    }))
    return songList;
}

/* Search songs */
export async function searchSongs(search: string, bookmark?: string) : Promise<{songList: Array<ISong>, bookmark?: string}> {
    const query = {
        query: {
            selector: {
                '@assetType': 'song',
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
                '@assetType': 'song',
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
    
    const songAssetList = response.data.result;
    const songList : Array<ISong> = await Promise.all((songAssetList.map(async (songAsset: { [x: string]: any; album: { [x: string]: string; }; artist: { [x: string]: string; }[]; title: any; explicit: any; }) : Promise<ISong> => {
    const albumName = await getAlbumNameByKey(songAsset.album['@key']);
        return {
            key : songAsset['@key'],
            assetType : songAsset['@assetType'],
            title: songAsset.title,
            explicit: songAsset.explicit,
            albumName: albumName,
            lastTouch: {
                byWho: songAsset['@lastTouchBy'],
                transactionType: songAsset['@lastTx']
            },
        }
    })))
    return {
        songList,
        ...(hasNext && newBookmark && { bookmark: newBookmark})
    };
}