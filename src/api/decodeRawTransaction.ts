import axios from "axios";
import { rpcUrl } from "../env";

export const decodeRawTransaction = async (param: string) => {
  return axios
    .post(
      rpcUrl,
      JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "decoderawtransaction",
        params: [param],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      return response.data.result;
    })
    .catch((err) => {
      return err;
    });
};
