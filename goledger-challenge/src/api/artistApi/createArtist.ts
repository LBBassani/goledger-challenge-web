import axios from "axios";

export async function createArtist(name: string, about: string) {
    const query = {
        'asset': [{
            '@assetType': 'artist',
            name,
            about
        }]
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/createAsset`;
    const response = await axios.post(endpoint, query);

    return response.data[0];
} 