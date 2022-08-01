"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const marina_1 = __importDefault(require("./marina/marina"));
const WALLET_NAME_1 = require("./WALLET_NAME");
class Wallet {
    constructor(marina, walletName = WALLET_NAME_1.WALLET_NAME.MARINA) {
        this.signTransaction = (pset) => this.wallet.signTransaction(pset);
        this.broadcastTransaction = (signedTxHex) => this.wallet.broadcastTransaction(signedTxHex);
        this.off = (listenerId) => this.wallet.off(listenerId);
        this.on = (type, callback) => this.wallet.on(type, callback);
        this.exist = () => this.wallet.exist();
        this.isEnabled = () => this.wallet.isEnabled();
        this.enable = () => this.wallet.enable();
        this.disable = () => this.wallet.disable();
        this.getNextAddress = () => this.wallet.getNextAddress();
        this.getAddresses = () => this.wallet.getAddresses();
        this.sendTransaction = (recipients) => this.wallet.sendTransaction(recipients);
        this.getBalances = () => this.wallet.getBalances();
        this.getNextChangeAddress = () => this.wallet.getNextChangeAddress();
        this.reloadCoins = () => this.wallet.reloadCoins();
        this.getCoins = () => this.wallet.getCoins();
        this.getNetwork = () => this.wallet.getNetwork();
        if (walletName === WALLET_NAME_1.WALLET_NAME.MARINA)
            this.wallet = new marina_1.default(marina);
        // TODO default wallet
        else
            this.wallet = new marina_1.default(marina);
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=index.js.map