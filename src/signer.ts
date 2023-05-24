import { networks } from "liquidjs-lib";
import { Wallet } from "./wallet";
import { AddressRecipient, DataRecipient } from "marina-provider";

export async function signTx(marina: Wallet, callData: string, recipients: AddressRecipient[], isTestnet = false): Promise<string> {
  const network = isTestnet ? networks.testnet : networks.liquid;
  const lbtc = network.assetHash;

  const dataRecipient: DataRecipient = {
    asset: lbtc,
    value: 0,
    data: callData,
  }

  const sent = await marina.sendTransaction([...recipients, dataRecipient]);
  return sent.txid;
};
