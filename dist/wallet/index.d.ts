import { AddressInterface, Balance, EventListenerID, MarinaEventType, NetworkString, Recipient, SentTransaction, Utxo } from 'marina-provider';
import { IWallet } from './IWallet';
import { WALLET_NAME } from './WALLET_NAME';
export declare class Wallet implements IWallet {
    private wallet;
    constructor(walletName?: WALLET_NAME);
    off: (listenerId: EventListenerID) => void;
    on: (type: MarinaEventType, callback: (payload: any) => void) => string;
    exist: () => boolean;
    isEnabled: () => Promise<boolean>;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    getNextAddress: () => Promise<AddressInterface>;
    getAddresses: () => Promise<AddressInterface[]>;
    sendTransaction: (recipients: Recipient[]) => Promise<SentTransaction>;
    getBalances: () => Promise<Balance[]>;
    getNextChangeAddress: () => Promise<AddressInterface>;
    reloadCoins: () => Promise<void>;
    getCoins: () => Promise<Utxo[]>;
    getNetwork: () => Promise<NetworkString>;
}
