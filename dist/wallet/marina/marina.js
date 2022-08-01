"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Marina {
    constructor(marina) {
        this.on = (type, callback) => {
            if (this.exist() && this.marina)
                return this.marina.on(type, callback);
            return "Marina wallet disabled.";
        };
        this.off = (listenerId) => {
            if (this.exist() && this.marina)
                this.marina.off(listenerId);
        };
        this.exist = () => typeof this.marina !== "undefined";
        this.isEnabled = () => {
            if (this.exist() && this.marina)
                return this.marina.isEnabled();
            // throw "Install Marina first";
            return Promise.resolve(false);
        };
        this.enable = () => {
            if (this.exist() && this.marina)
                return this.marina.enable();
            // else throw "Install Marina first";
            return Promise.resolve();
        };
        this.disable = () => {
            if (this.exist() && this.marina)
                return this.marina.disable();
            // else throw "Install Marina first";
            return Promise.resolve();
        };
        this.marina = marina;
    }
    importTemplate(template, changeTemplate) {
        throw new Error("Method not implemented.");
    }
    getAccountInfo(accountID) {
        throw new Error("Method not implemented.");
    }
    getAccountsIDs() {
        throw new Error("Method not implemented.");
    }
    signTransaction(pset) {
        if (this.exist() && this.marina)
            return this.marina.signTransaction(pset);
        throw new Error("Marina wallet disabled.");
    }
    broadcastTransaction(signedTxHex) {
        if (this.exist() && this.marina)
            return this.marina.broadcastTransaction(signedTxHex);
        throw new Error("Marina wallet disabled.");
    }
    getNextAddress() {
        if (this.exist() && this.marina)
            return this.marina.getNextAddress();
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    }
    getAddresses() {
        if (this.exist() && this.marina)
            return this.marina.getAddresses();
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    }
    sendTransaction(recipients) {
        if (this.exist() && this.marina)
            return this.marina.sendTransaction(recipients);
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    }
    getNextChangeAddress() {
        if (this.exist() && this.marina)
            return this.marina.getNextChangeAddress();
        throw new Error("Marina wallet disabled.");
    }
    getBalances() {
        if (this.exist() && this.marina)
            return this.marina.getBalances();
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    }
    reloadCoins() {
        if (this.exist() && this.marina)
            return this.marina.reloadCoins();
        return Promise.reject("Marina wallet disabled.");
    }
    getCoins() {
        if (this.exist() && this.marina)
            return this.marina.getCoins();
        return Promise.reject("Marina wallet disabled.");
    }
    getNetwork() {
        if (this.exist() && this.marina)
            return this.marina.getNetwork();
        return Promise.reject("Marina wallet disabled.");
    }
    setAccount( /*account: number*/) {
        throw new Error("Method not implemented.");
    }
    blindTransaction( /*pset: string*/) {
        throw new Error("Method not implemented.");
    }
    signMessage( /*message: string*/) {
        throw new Error("Method not implemented.");
    }
    getTransactions() {
        throw new Error("Method not implemented.");
    }
    getFeeAssets() {
        throw new Error("Method not implemented.");
    }
    isReady() {
        throw new Error("Method not implemented.");
    }
    getSelectedAccount() {
        throw new Error("Method not implemented.");
    }
    createAccount(accountName) {
        throw new Error("Method not implemented.");
    }
    useAccount(account) {
        throw new Error("Method not implemented.");
    }
}
exports.default = Marina;
//# sourceMappingURL=marina.js.map