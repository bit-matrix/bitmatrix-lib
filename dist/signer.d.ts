import { Wallet } from "./wallet";
import { AddressRecipient } from "marina-provider";
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
export declare function signTx(marina: Wallet, callData: string, recipients: AddressRecipient[], lbtc?: string): Promise<string>;
