import axios from "axios";
import { bmUrl } from "../env";

export const getPools = async (poolId: string) => {
  return axios
    .get(`${bmUrl}/pools/${poolId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
