import { Pool } from "@bitmatrix/models";
import axios from "axios";
import { bmUrl } from "../envtest";

export const getPools = async (): Promise<Pool[]> => {
  return axios
    .get<Pool[]>(`${bmUrl}/pools`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
