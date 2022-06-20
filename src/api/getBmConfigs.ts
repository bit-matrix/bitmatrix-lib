import axios from "axios";
import { BmConfig } from "@bitmatrix/models";
import { bmUrl } from "../env";

export const getBmConfigs = async (): Promise<BmConfig> => {
  return axios
    .get<BmConfig>(`${bmUrl}/config`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
