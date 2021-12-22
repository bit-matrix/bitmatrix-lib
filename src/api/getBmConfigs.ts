import axios from "axios";
import { BmConfig } from "@bitmatrix/models";

export const getBmConfigs = async (poolId: string): Promise<BmConfig> => {
  return axios
    .get<BmConfig>(`https://db.bitmatrix-aggregate.com/config/${poolId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
