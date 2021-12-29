import axios from "axios";
import { BmCtxMempool } from "@bitmatrix/models";
import { bmUrl } from "../env";

export const getCtxMempool = async (ctxId: string, poolId: string): Promise<BmCtxMempool> => {
  return axios
    .get<BmCtxMempool>(`${bmUrl}/ctx/${poolId}/${ctxId}?mempool=true`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
