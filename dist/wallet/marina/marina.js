"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Marina = /** @class */ (function () {
    function Marina(marina) {
        var _this = this;
        this.on = function (type, callback) {
            if (_this.exist() && _this.marina)
                return _this.marina.on(type, callback);
            return "Marina wallet disabled.";
        };
        this.off = function (listenerId) {
            if (_this.exist() && _this.marina)
                _this.marina.off(listenerId);
        };
        this.exist = function () { return typeof _this.marina !== "undefined"; };
        this.isEnabled = function () {
            if (_this.exist() && _this.marina)
                return _this.marina.isEnabled();
            // throw "Install Marina first";
            return Promise.resolve(false);
        };
        this.enable = function () {
            if (_this.exist() && _this.marina)
                return _this.marina.enable();
            // else throw "Install Marina first";
            return Promise.resolve();
        };
        this.disable = function () {
            if (_this.exist() && _this.marina)
                return _this.marina.disable();
            // else throw "Install Marina first";
            return Promise.resolve();
        };
        this.marina = marina;
    }
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
    Marina.prototype.reloadCoins = function () {
        if (this.exist() && this.marina)
            return this.marina.reloadCoins();
        return Promise.reject("Marina wallet disabled.");
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
    Marina.prototype.setAccount = function ( /*account: number*/) {
        throw new Error("Method not implemented.");
    };
    Marina.prototype.blindTransaction = function ( /*pset: string*/) {
        throw new Error("Method not implemented.");
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
    Marina.prototype.importTemplate = function (template, changeTemplate) {
        throw new Error("Method not implemented.");
    };
    return Marina;
}());
exports.default = Marina;
//# sourceMappingURL=marina.js.map