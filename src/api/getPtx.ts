import axios from "axios";
import { BmPtx } from "@bitmatrix/models";
import { bmUrl } from "../envtest";

export const getPtx = async (ctxId: string, poolId: string): Promise<BmPtx> => {
  return axios
    .get<BmPtx>(`${bmUrl}/ptx/${poolId}/${ctxId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
