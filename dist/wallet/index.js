"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
var marina_1 = __importDefault(require("./marina/marina"));
var WALLET_NAME_1 = require("./WALLET_NAME");
var Wallet = /** @class */ (function () {
    function Wallet(marina, walletName) {
        if (walletName === void 0) { walletName = WALLET_NAME_1.WALLET_NAME.MARINA; }
        var _this = this;
        this.blindTransaction = function (pset) { return _this.wallet.blindTransaction(pset); };
        this.signTransaction = function (pset) { return _this.wallet.signTransaction(pset); };
        this.broadcastTransaction = function (signedTxHex) { return _this.wallet.broadcastTransaction(signedTxHex); };
        this.off = function (listenerId) { return _this.wallet.off(listenerId); };
        this.on = function (type, callback) { return _this.wallet.on(type, callback); };
        this.exist = function () { return _this.wallet.exist(); };
        this.isEnabled = function () { return _this.wallet.isEnabled(); };
        this.enable = function () { return _this.wallet.enable(); };
        this.disable = function () { return _this.wallet.disable(); };
        this.getNextAddress = function () { return _this.wallet.getNextAddress(); };
        this.getAddresses = function () { return _this.wallet.getAddresses(); };
        this.sendTransaction = function (recipients) { return _this.wallet.sendTransaction(recipients); };
        this.getBalances = function () { return _this.wallet.getBalances(); };
        this.getNextChangeAddress = function () { return _this.wallet.getNextChangeAddress(); };
        this.getCoins = function () { return _this.wallet.getCoins(); };
        this.getNetwork = function () { return _this.wallet.getNetwork(); };
        if (walletName === WALLET_NAME_1.WALLET_NAME.MARINA)
            this.wallet = new marina_1.default(marina);
        // TODO default wallet
        else
            this.wallet = new marina_1.default(marina);
    }
    return Wallet;
}());
exports.Wallet = Wallet;
//# sourceMappingURL=index.js.map