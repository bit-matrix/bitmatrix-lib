import axios from "axios";
import { BmPtx } from "@bitmatrix/models";
import { bmUrl } from "../env";

export const getPtx = async (ptxId: string, poolId: string): Promise<BmPtx> => {
  return axios
    .get<BmPtx>(`${bmUrl}/ptx/${poolId}/${ptxId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
