import { RecipientInterface } from "ldk";
import { Wallet } from "./wallet";
export declare const signTx: (marina: Wallet, callData: string, recipients: RecipientInterface[]) => Promise<string>;
