import axios from "axios";

export async function deleteAlbumByKey(key:string) {
    const query = {
        'key': {
            '@assetType': 'album',
            '@key': key
        }
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/deleteAsset`;
    const response = await axios.delete(endpoint, {
        data: query
    });

    return response;
} 