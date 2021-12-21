import axios from "axios";

export const getPools = () => {
  return axios
    .get("https://db.bitmatrix-aggregate.com/pools/43a2f4ef8ce286e57ab3e39e6da3741382ba542854a1b28231a7a5b8ba337fcd")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
