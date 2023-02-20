import { Address, Balance, EventListenerID, MarinaEventType, NetworkString, Recipient, SentTransaction, Utxo } from "marina-provider";
export interface IWallet {
    exist(): boolean;
    on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;
    off(listenerId: EventListenerID): void;
    isEnabled(): Promise<boolean>;
    enable(): Promise<void>;
    disable(): Promise<void>;
    getNextAddress(): Promise<Address>;
    getAddresses(): Promise<Address[]>;
    sendTransaction(recipients: Recipient[]): Promise<SentTransaction>;
    getBalances(): Promise<Balance[]>;
    getNextChangeAddress(): Promise<Address>;
    blindTransaction(pset: string): Promise<string>;
    getCoins(): Promise<Utxo[]>;
    getNetwork(): Promise<NetworkString>;
    signTransaction(pset: string): Promise<string>;
    broadcastTransaction(signedTxHex: string): Promise<SentTransaction>;
}
