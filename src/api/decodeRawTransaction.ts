import axios from "axios";

export const decodeRawTransaction = async (param: string) => {
  return axios
    .post(
      "http://157.230.101.158:9485/rpc",
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
