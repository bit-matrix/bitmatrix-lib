import { AddressInterface, Balance, DescriptorTemplate, EventListenerID, MarinaEventType, MarinaProvider, NetworkString, Recipient, SentTransaction, SignedMessage, Transaction, Utxo } from "marina-provider";
declare global {
    interface Window {
        marina?: MarinaProvider;
    }
}
export declare const marina: MarinaProvider | undefined;
export default class Marina implements MarinaProvider {
    private marina;
    constructor();
    isReady(): Promise<boolean>;
    getSelectedAccount(): Promise<string>;
    createAccount(accountName: string): Promise<void>;
    useAccount(account: string): Promise<boolean>;
    importTemplate(template: DescriptorTemplate, changeTemplate?: DescriptorTemplate): Promise<void>;
    broadcastTransaction(signedTxHex: string): Promise<SentTransaction>;
    on: (type: MarinaEventType, callback: (payload: any) => void) => string;
    off: (listenerId: EventListenerID) => void;
    exist: () => boolean;
    isEnabled: () => Promise<boolean>;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    getNextAddress(): Promise<AddressInterface>;
    getAddresses(): Promise<AddressInterface[]>;
    sendTransaction(recipients: Recipient[]): Promise<SentTransaction>;
    getNextChangeAddress(): Promise<AddressInterface>;
    getBalances(): Promise<Balance[]>;
    reloadCoins(): Promise<void>;
    getCoins(): Promise<Utxo[]>;
    getNetwork(): Promise<NetworkString>;
    setAccount(): Promise<void>;
    blindTransaction(): Promise<string>;
    signTransaction(): Promise<string>;
    signMessage(): Promise<SignedMessage>;
    getTransactions(): Promise<Transaction[]>;
    getFeeAssets(): Promise<string[]>;
}
