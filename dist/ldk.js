"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTx = void 0;
var ldk_1 = require("ldk");
var liquidjs_lib_1 = require("liquidjs-lib");
var ecc = __importStar(require("tiny-secp256k1"));
var utils_1 = require("./utils/utils");
var helper_1 = require("./utils/helper");
var signTx = function (marina, callData, recipients, isTestnet) {
    if (isTestnet === void 0) { isTestnet = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var coins, pset, tx, makeGetter, assets, uniqueAssets, changeAddressGetter, unsignedTx, ptx, inputBlindingMap, outputBlindingMap, signedTx, finalTx, txFinal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, marina.getCoins()];
                case 1:
                    coins = _a.sent();
                    pset = new liquidjs_lib_1.Psbt({ network: isTestnet ? liquidjs_lib_1.networks.testnet : liquidjs_lib_1.networks.liquid });
                    tx = pset.toBase64();
                    makeGetter = makeAssetChangeGetter(marina);
                    assets = recipients.map(function (r) { return r.asset; });
                    uniqueAssets = (0, helper_1.uniqueArray)(assets);
                    return [4 /*yield*/, makeGetter(uniqueAssets)];
                case 2:
                    changeAddressGetter = _a.sent();
                    unsignedTx = (0, ldk_1.craftMultipleRecipientsPset)({
                        psetBase64: tx,
                        unspents: coins,
                        recipients: recipients,
                        coinSelector: (0, ldk_1.greedyCoinSelector)(),
                        changeAddressByAsset: changeAddressGetter,
                        addFee: true,
                    });
                    ptx = liquidjs_lib_1.Psbt.fromBase64(unsignedTx);
                    ptx.addOutput({
                        script: liquidjs_lib_1.script.compile([liquidjs_lib_1.script.OPS.OP_RETURN, Buffer.from(callData, "hex")]),
                        value: liquidjs_lib_1.confidential.satoshiToConfidentialValue(0),
                        asset: liquidjs_lib_1.AssetHash.fromHex(liquidjs_lib_1.networks.testnet.assetHash, false).bytes,
                        nonce: Buffer.alloc(0),
                    });
                    inputBlindingMap = (0, utils_1.inputBlindingDataMap)(unsignedTx, coins);
                    outputBlindingMap = (0, utils_1.outPubKeysMap)(unsignedTx, [changeAddressGetter(liquidjs_lib_1.networks.testnet.assetHash), recipients[0].address]);
                    return [4 /*yield*/, ptx.blindOutputsByIndex(liquidjs_lib_1.Psbt.ECCKeysGenerator(ecc), inputBlindingMap, outputBlindingMap)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, marina.signTransaction(ptx.toBase64())];
                case 4:
                    signedTx = _a.sent();
                    finalTx = liquidjs_lib_1.Psbt.fromBase64(signedTx);
                    finalTx.finalizeAllInputs();
                    return [4 /*yield*/, marina.broadcastTransaction(finalTx.extractTransaction().toHex())];
                case 5:
                    txFinal = _a.sent();
                    return [2 /*return*/, txFinal.txid];
            }
        });
    });
};
exports.signTx = signTx;
var makeAssetChangeGetter = function (marina) {
    return function (assets) { return __awaiter(void 0, void 0, void 0, function () {
        var addresses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(assets.map(function (_) { return marina.getNextChangeAddress(); }))];
                case 1:
                    addresses = _a.sent();
                    return [2 /*return*/, function (asset) {
                            console.log(asset);
                            var index = assets.findIndex(function (a) { return a === asset; });
                            return addresses[index].confidentialAddress;
                        }];
            }
        });
    }); };
};
//# sourceMappingURL=ldk.js.map