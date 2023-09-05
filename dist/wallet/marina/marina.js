"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Marina = /** @class */ (function () {
    function Marina(marina) {
        this.marina = marina;
    }
    Marina.prototype.getAccountInfo = function (accountID) {
        if (!this.exist() || !this.marina)
            throw new Error("Marina wallet disabled.");
        return this.marina.getAccountInfo(accountID);
    };
    Marina.prototype.getAccountsIDs = function () {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.signTransaction = function (pset) {
        if (this.exist() && this.marina)
            return this.marina.signTransaction(pset);
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.broadcastTransaction = function (signedTxHex) {
        if (this.exist() && this.marina)
            return this.marina.broadcastTransaction(signedTxHex);
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.on = function (type, callback) {
        if (this.exist() && this.marina)
            return this.marina.on(type, callback);
        return "Marina wallet disabled.";
    };
    ;
    Marina.prototype.off = function (listenerId) {
        if (this.exist() && this.marina)
            this.marina.off(listenerId);
    };
    ;
    Marina.prototype.exist = function () {
        return typeof this.marina !== "undefined";
    };
    Marina.prototype.isEnabled = function () {
        if (this.exist() && this.marina)
            return this.marina.isEnabled();
        // throw "Install Marina first";
        return Promise.resolve(false);
    };
    ;
    Marina.prototype.enable = function () {
        if (this.exist() && this.marina)
            return this.marina.enable();
        // else throw "Install Marina first";
        return Promise.resolve();
    };
    ;
    Marina.prototype.disable = function () {
        if (this.exist() && this.marina)
            return this.marina.disable();
        // else throw "Install Marina first";
        return Promise.resolve();
    };
    ;
    Marina.prototype.getNextAddress = function () {
        if (this.exist() && this.marina)
            return this.marina.getNextAddress();
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.getAddresses = function () {
        if (this.exist() && this.marina)
            return this.marina.getAddresses();
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.sendTransaction = function (recipients) {
        if (this.exist() && this.marina)
            return this.marina.sendTransaction(recipients);
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.getNextChangeAddress = function () {
        if (this.exist() && this.marina)
            return this.marina.getNextChangeAddress();
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.getBalances = function () {
        if (this.exist() && this.marina)
            return this.marina.getBalances();
        // else throw "Install Marina first";
        throw new Error("Marina wallet disabled.");
    };
    Marina.prototype.getCoins = function () {
        if (this.exist() && this.marina)
            return this.marina.getCoins();
        return Promise.reject("Marina wallet disabled.");
    };
    Marina.prototype.getNetwork = function () {
        if (this.exist() && this.marina)
            return this.marina.getNetwork();
        return Promise.reject("Marina wallet disabled.");
    };
    Marina.prototype.blindTransaction = function (pset) {
        var _a;
        return ((_a = this.marina) === null || _a === void 0 ? void 0 : _a.blindTransaction(pset)) || Promise.reject("Marina wallet disabled.");
    };
    Marina.prototype.signMessage = function ( /*message: string*/) {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.getTransactions = function () {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.getFeeAssets = function () {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.isReady = function () {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.getSelectedAccount = function () {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.createAccount = function (accountName) {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.useAccount = function (account) {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.importScript = function (accountName, scriptHex, blindingPrivateKey) {
        throw new Error("Method not implemented.");
    };
    return Marina;
}());
exports.default = Marina;
//# sourceMappingURL=marina.js.map