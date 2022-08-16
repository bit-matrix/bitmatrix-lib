import { esploraClient, TxDetail, TxOutSpend, init } from "@bitmatrix/esplora-api-client";
import { electrsUrl } from "./env";

init(electrsUrl);

const txDetailPromise = async (txId: string): Promise<[TxDetail, TxOutSpend[]]> => {
  const txDetail = new Promise<TxDetail>((resolve, reject) => {
    esploraClient
      .tx(txId)
      .then((tx: TxDetail) => {
        resolve(tx);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

  const txOutSpends = new Promise<TxOutSpend[]>((resolve, reject) => {
    esploraClient
      .txOutspends(txId)
      .then((txOutSpend: TxOutSpend[]) => {
        resolve(txOutSpend);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

  return Promise.all([txDetail, txOutSpends]);
};

export { txDetailPromise };
