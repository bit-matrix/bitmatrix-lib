import { Wallet } from "./wallet";
import { AddressRecipient } from "marina-provider";
export declare function signTx(marina: Wallet, callData: string, recipients: AddressRecipient[], isTestnet?: boolean): Promise<string>;
