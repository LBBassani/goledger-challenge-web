import axios from "axios";
import IAlbum from "../../types/album";
import { getAlbumByKey } from "./getAlbum";

export async function updateAlbumByKey(updatedValue: IAlbum) : Promise<IAlbum>{
    const query = {
        update: {
            '@assetType': updatedValue.assetType,
            '@key': updatedValue.key,
            'rating' : updatedValue.rating,
            'releaseDate' : updatedValue.releaseDate
        }
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/updateAsset`;
    const response = await axios.put(endpoint, query);

    const albumAsset = response.data;
    return getAlbumByKey(albumAsset['@key']);
}