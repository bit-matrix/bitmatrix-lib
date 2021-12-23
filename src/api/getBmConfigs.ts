import axios from "axios";
import { BmConfig } from "@bitmatrix/models";
import { bmUrl } from "../env";

export const getBmConfigs = async (poolId: string): Promise<BmConfig> => {
  return axios
    .get<BmConfig>(`${bmUrl}/config/${poolId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
