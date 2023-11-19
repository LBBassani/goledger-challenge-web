import axios from "axios";

export async function createAlbum(title:string, releaseDate: string, rating: number, artistKey: string) {
    const query = {
        'asset': [{
            '@assetType': 'album',
            title,
            releaseDate,
            rating,
            artist: {
                '@assetType' : 'artist',
                '@key' : artistKey
            }
        }]
    };

    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/createAsset`;
    const response = await axios.post(endpoint, query);

    return response.data[0];
}