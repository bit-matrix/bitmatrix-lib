import { Pool } from "@bitmatrix/models";
import axios from "axios";
import { bmUrl } from "../env";

export const getPoolById = async (poolId: string): Promise<Pool> => {
  return axios
    .get<Pool>(`${bmUrl}/pools/${poolId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
