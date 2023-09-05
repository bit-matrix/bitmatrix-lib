import { Wallet } from "./wallet";
import { AddressRecipient, DataRecipient } from "marina-provider";

const LIQUID_LBTC = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d'

/**
 * craft a transaction with OP_RETURN callData + recipients
 * blind and sign the transaction
 * broadcast the transaction via marina
 * @param marina marina provider wallet
 * @param callData data setup in OP_RETURN script
 * @param recipients other recipients of the tx
 * @param lbtc asset hash of the network lbtc asset (default: liquid lbtc)
 * @returns the txid of the transaction
 */
export async function signTx(marina: Wallet, callData: string, recipients: AddressRecipient[], lbtc = LIQUID_LBTC): Promise<string> {
  const dataRecipient: DataRecipient = {
    asset: lbtc,
    value: 0,
    data: callData,
  }

  const sent = await marina.sendTransaction([...recipients, dataRecipient]);
  return sent.txid;
};
