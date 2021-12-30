import { BmChart } from "@bitmatrix/models";
import axios from "axios";
import { bmApiUrl } from "../env";

export const getPoolChartData = async (poolId: string): Promise<BmChart[]> => {
  return axios
    .get<BmChart[]>(`${bmApiUrl}/chart/${poolId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
