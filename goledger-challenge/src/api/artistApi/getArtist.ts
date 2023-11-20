import axios from 'axios';
import IArtist from '../../types/artist';

/* Returns the complete data of the artist indicated by the id/key */
export async function getArtistByKey(id:string) : Promise<IArtist>{
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAssetHistory`;
    const response = await axios.post(endpoint, query);

    const artistHistory = response.data;
    const artistAsset = artistHistory[0];

    return {
        about : artistAsset.about,
        name : artistAsset.name,
        assetType : artistAsset['@assetType'],
        key : artistAsset['@key'],
        lastTouch : {
            byWho : artistAsset['@lastTouchBy'],
            isDeleted: artistAsset['_isDelete'],
            timestamp: artistAsset['_timestamp'],
            transactionId: artistAsset['_txId'],
            transactionType: artistAsset['@lastTx']
        }
    }
}

/* Returns brief of artist by indicated id/key */
export async function getArtistBriefByKey(id: string) : Promise<IArtist> {
    const query = {
        key: {
            '@key' : id 
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/readAsset`;
    const response = await axios.post(endpoint, query);

    const artistAsset = response.data;
    return {
        about: artistAsset.about,
        name: artistAsset.name,
        assetType : artistAsset['@assetType'],
        key : artistAsset['@key'],
        lastTouch: {
            byWho : artistAsset['@lastTouchBy'],
            transactionType: artistAsset['@lastTx']
        }
    }
}

/* Search artists */
export async function searchArtists(search:string) {
    const query = {
        query: {
            selector: {
                '@assetType': 'artist',
                ...(search && {name: {
                    '$regex' : `(.*)${search}(.*)`
                }})
            }
        }
    };
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/query/search`;
    const response = await axios.post(endpoint, query);

    const artistAssetList = response.data.result;
    const artistList : Array<IArtist> = await Promise.all(artistAssetList.map(async (artistAsset: { [x: string]: any; artist: { [x: string]: string; }; rating: any; releaseDate: any; title: any; }) : Promise<IArtist> => {
        return {
            about: artistAsset.about,
            name: artistAsset.name,
            assetType : artistAsset['@assetType'],
            key : artistAsset['@key'],
            lastTouch: {
                byWho : artistAsset['@lastTouchBy'],
                transactionType: artistAsset['@lastTx']
            }
        }
    }))
    
    return artistList;
}