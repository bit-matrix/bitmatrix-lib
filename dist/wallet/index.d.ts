import { AccountInfo, Address, Balance, EventListenerID, MarinaEventType, MarinaProvider, NetworkString, Recipient, SentTransaction, Utxo } from "marina-provider";
import { IWallet } from "./IWallet";
import { WALLET_NAME } from "./WALLET_NAME";
export declare class Wallet implements IWallet {
    private wallet;
    constructor(marina: MarinaProvider, walletName?: WALLET_NAME);
    blindTransaction: (pset: string) => Promise<string>;
    signTransaction: (pset: string) => Promise<string>;
    broadcastTransaction: (signedTxHex: string) => Promise<SentTransaction>;
    off: (listenerId: EventListenerID) => void;
    on: (type: MarinaEventType, callback: (payload: any) => void) => string;
    exist: () => boolean;
    isEnabled: () => Promise<boolean>;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    getNextAddress: () => Promise<Address>;
    getAddresses: () => Promise<Address[]>;
    sendTransaction: (recipients: Recipient[]) => Promise<SentTransaction>;
    getBalances: () => Promise<Balance[]>;
    getNextChangeAddress: () => Promise<Address>;
    getCoins: () => Promise<Utxo[]>;
    getNetwork: () => Promise<NetworkString>;
    getAccountInfo: (accountID: string) => Promise<AccountInfo>;
}
