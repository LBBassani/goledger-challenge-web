import axios from 'axios';
import IPlaylist from '../../types/playlist';
import { getPlaylistByKey } from './getPlaylist';

export async function updatePlaylistByKey(updatedValue: IPlaylist, newSongList?: Array<string>) {
    const query = {
        update: {
            '@assetType': updatedValue.assetType,
            '@key': updatedValue.key,
            'description': updatedValue.description,
            ...(newSongList && {'songs': newSongList.map((song) => {
                return {'@assetType' : 'song', '@key' : song}
            })})
        }
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/updateAsset`;
    const response = await axios.put(endpoint, query);

    const playlistAsset = response.data;
    return getPlaylistByKey(playlistAsset['@key']);
}