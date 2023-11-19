import axios from "axios";

export async function deleteArtistByKey(key:string) {
    const query = {
        'key': {
            '@assetType': 'artist',
            '@key': key
        }
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/deleteAsset`;
    const response = await axios.delete(endpoint, {
        data: query
    });

    return response;
} 