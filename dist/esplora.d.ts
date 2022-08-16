import { TxDetail, TxOutSpend } from "@bitmatrix/esplora-api-client";
declare const txDetailPromise: (txId: string) => Promise<[TxDetail, TxOutSpend[]]>;
export { txDetailPromise };
