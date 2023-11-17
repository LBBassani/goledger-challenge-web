import axios from "axios";
import ISong from "../types/song";

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