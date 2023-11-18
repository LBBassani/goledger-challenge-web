import axios from 'axios';
import IArtist from '../../types/artist';
import { getArtistByKey } from './getArtist';

export async function updateArtistByKey(updatedValue: IArtist) : Promise<IArtist> {
        const query = {
            update: {
                '@assetType': updatedValue.assetType,
                '@key': updatedValue.key,
                'about': updatedValue.about,
            }
        }
        const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/updateAsset`;
        const response = await axios.put(endpoint, query);

        const artistAsset = response.data;
        return getArtistByKey(artistAsset['@key']);
}