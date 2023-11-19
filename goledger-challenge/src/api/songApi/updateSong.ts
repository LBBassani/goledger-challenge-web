import axios from "axios";
import ISong from "../../types/song";
import { getSongByKey } from "./getSong";

export async function updateSongByKey(updatedValue: ISong) {
    const query = {
        update: {
          "@assetType": updatedValue.assetType,
          "@key": updatedValue.key,
          "explicit" : updatedValue.explicit,
          ...(updatedValue.album && {"album" : {"@assetType": updatedValue.album.assetType, "@key": updatedValue.album.key}})
        }
    }
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/invoke/updateAsset`;
    const response = await axios.put(endpoint, query);

    const songAsset = response.data;
    return getSongByKey(songAsset['@key']);
}