import axios from "axios";

export async function createSong(title: string, explicit: boolean, albumKey: string, artists: Array<string>) {
    const query = {
        'asset': [{
            '@assetType': 'song',
            title,
            explicit,
            album: {
                '@assetType': 'album',
                '@key': albumKey
            },
            artists: artists.map((artistKey) => {
                return {
                    '@assetType': 'artist',
                    '@key': artistKey
                }
            })
            
        }]
    }
    console.log(query)

    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/createAsset`;
    const response = await axios.post(endpoint, query);

    return response.data[0];
} 