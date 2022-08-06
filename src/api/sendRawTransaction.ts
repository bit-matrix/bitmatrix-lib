import axios from "axios";
import { rpcUrl } from "../envtest";

export const sendRawTransaction = async (param: string): Promise<string> => {
  return axios
    .post(
      rpcUrl,
      JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "sendrawtransaction",
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
