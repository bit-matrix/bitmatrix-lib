import axios from "axios";
import { BmCtxNew } from "@bitmatrix/models";
import { bmUrl } from "../envtest";

export const getCtx = async (ctxId: string, poolId: string): Promise<BmCtxNew> => {
  return axios
    .get<BmCtxNew>(`${bmUrl}/ctx/${poolId}/${ctxId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
