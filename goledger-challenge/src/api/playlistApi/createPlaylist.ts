import axios from "axios";

export default async function createPlaylist(name: string, description: string, songKeyList: Array<string>){
    const query = {
        asset: [
            {
                '@assetType': 'playlist',
                name,
                description,
                'songs': songKeyList.map((songKey) => {
                    return {
                        '@assetType': 'song',
                        '@key' : songKey
                    }
                })
            }
        ]
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/createAsset`;
    const response = await axios.post(endpoint, query);

    return response.data[0];

}