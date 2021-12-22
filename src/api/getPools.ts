import axios from "axios";

export const getPools = async (poolId: string) => {
  return axios
    .get(`https://db.bitmatrix-aggregate.com/pools/${poolId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
