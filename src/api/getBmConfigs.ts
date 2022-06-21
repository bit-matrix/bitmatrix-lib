import axios from "axios";
import { BmConfig } from "@bitmatrix/models";

export const getBmConfigs = async (): Promise<BmConfig> => {
  return axios
    .get<BmConfig>("https://raw.githubusercontent.com/bit-matrix/bitmatrix-app-config/master/testnet.json")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
