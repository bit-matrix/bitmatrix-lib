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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitmentFinder = void 0;
var lib_core_1 = require("@script-wiz/lib-core");
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var decimal_js_1 = __importDefault(require("decimal.js"));
var _1 = require(".");
var lbtcAssest = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";
var commitmentFinder = function (transaction, pools) { return __awaiter(void 0, void 0, void 0, function () {
    var rawTransactionHex, decodedTransaction, outputs, outputCount, inputs, inputCount, cmtTxLocktimeByteLength, cmtTxInOutpoints, nSequences, nsequenceValue, opReturnOutput, opReturnOutputScriptHex, poolId, pool, methodCall, publicKey, slippageTolerance, orderingFee, cmtOutput1, cmtOutput2, changeOutputs, cmtOutput3, i, cmtOutput1Value, pair1Asset, pair2Asset, output2PairValue, cmtOutput2Value, cmtOutput3PairValue, cmtOutput3Value, cmtOutput3Asset, outputsLength, cmtOutputFeeValue, cmtOutputFeeHexValue, seperatedChangeOutputs, changeOutputFinal, isAddLiquidity, commitmentOutputResult, tapTweakedResult, tapTweakedResultPrefix;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _1.api.getRawTransaction(transaction.txid)];
            case 1:
                rawTransactionHex = _a.sent();
                return [4 /*yield*/, _1.api.decodeRawTransaction(rawTransactionHex)];
            case 2:
                decodedTransaction = _a.sent();
                outputs = decodedTransaction.vout;
                if (outputs.length > 8 && outputs.length < 4)
                    return [2 /*return*/, undefined];
                outputCount = wiz_data_1.default.fromNumber(outputs.length);
                inputs = decodedTransaction.vin;
                if (inputs.length > 12)
                    return [2 /*return*/, undefined];
                inputCount = wiz_data_1.default.fromNumber(inputs.length);
                cmtTxLocktimeByteLength = lib_core_1.convertion.numToLE32(wiz_data_1.default.fromNumber(decodedTransaction.locktime)).hex;
                cmtTxInOutpoints = inputs.map(function (inp, index) {
                    var vout32Byte = lib_core_1.convertion.numToLE32(wiz_data_1.default.fromNumber(inp.vout));
                    return { index: index, data: (0, wiz_data_1.hexLE)(inp.txid) + vout32Byte.hex };
                });
                nSequences = inputs.map(function (inp) { return inp.sequence; });
                //Every nsequence must equal
                if (nSequences.every(function (ns) { return ns !== nSequences[0]; }))
                    return [2 /*return*/, undefined];
                nsequenceValue = nSequences[0].toString(16);
                opReturnOutput = outputs[0].scriptPubKey.asm.split(" ");
                if (opReturnOutput[0] !== "OP_RETURN")
                    return [2 /*return*/, undefined];
                opReturnOutputScriptHex = opReturnOutput[1];
                poolId = (0, wiz_data_1.hexLE)(opReturnOutputScriptHex.substring(0, 64));
                pool = pools.find(function (p) {
                    return p.id === poolId && p.active;
                });
                if (!pool)
                    return [2 /*return*/, undefined];
                methodCall = opReturnOutputScriptHex.substring(64, 66);
                publicKey = opReturnOutputScriptHex.substring(66, 132);
                slippageTolerance = opReturnOutputScriptHex.substring(132, 148);
                orderingFee = opReturnOutputScriptHex.substring(148, 156);
                cmtOutput1 = outputs[1];
                cmtOutput2 = outputs[2];
                changeOutputs = [];
                if (outputCount.number) {
                    i = 3;
                    if (methodCall === "03") {
                        i = 4;
                        cmtOutput3 = outputs[3];
                    }
                    for (i; i < outputCount.number - 1; i++) {
                        changeOutputs.push(outputs[i]);
                    }
                }
                // 6. Commitment out 1 (Calldatadan hemen sonraki output)’in taşıdığı L-BTC değeri 8 byte LE olarak.
                if (cmtOutput1.asset !== lbtcAssest)
                    Promise.reject("Asset must be L-BTC");
                cmtOutput1Value = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutput1.value).mul(100000000).toNumber())).hex;
                pair1Asset = pool.quote.assetHash;
                pair2Asset = pool.token.assetHash;
                output2PairValue = "00";
                if (cmtOutput2.asset === pair2Asset)
                    output2PairValue = "01";
                if (cmtOutput2.asset === pair1Asset)
                    output2PairValue = "03";
                if (methodCall === "04")
                    output2PairValue = "02";
                //   8. Commitment out 2 ’in taşıdığı asset değeri 8 byte LE olarak.
                if (cmtOutput2.value === undefined)
                    Promise.reject("Commitment Output Value musn't be confidential.");
                cmtOutput2Value = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutput2.value).mul(100000000).toNumber())).hex;
                cmtOutput3PairValue = "00";
                if (methodCall === "03" && cmtOutput3) {
                    if (cmtOutput3.asset === pair2Asset)
                        cmtOutput3PairValue = "01";
                    if (cmtOutput3.asset === pair1Asset)
                        cmtOutput3PairValue = "03";
                    cmtOutput3Value = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutput3.value).mul(100000000).toNumber())).hex;
                    cmtOutput3Asset = cmtOutput3.asset;
                }
                outputsLength = outputCount.number;
                cmtOutputFeeValue = outputs[outputsLength - 1].value || 0;
                cmtOutputFeeHexValue = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutputFeeValue).mul(100000000).toNumber())).hex;
                seperatedChangeOutputs = changeOutputs.map(function (co, index) {
                    if (co.asset) {
                        return {
                            index: index + 1,
                            asset: "01" + (0, wiz_data_1.hexLE)(co.asset),
                            value: "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(new decimal_js_1.default(co.value).mul(100000000).toNumber())).hex),
                            amount: "01" + lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(new decimal_js_1.default(co.value).mul(100000000).toNumber())).hex,
                            nonce: "00",
                            scriptpubkey: wiz_data_1.default.fromNumber(co.scriptPubKey.hex.length / 2).hex + co.scriptPubKey.hex,
                        };
                    }
                    return {
                        index: index + 1,
                        asset: co.assetcommitment,
                        value: co.valuecommitment,
                        amount: co.valuecommitment,
                        nonce: co.commitmentnonce,
                        scriptpubkey: wiz_data_1.default.fromNumber(co.scriptPubKey.hex.length / 2).hex + co.scriptPubKey.hex,
                    };
                });
                changeOutputFinal = seperatedChangeOutputs.map(function (cof) {
                    return {
                        index: cof.index,
                        assetValue: cof.asset + cof.value,
                        noncScpkey: cof.nonce + cof.scriptpubkey,
                    };
                });
                isAddLiquidity = false;
                commitmentOutputResult = undefined;
                commitmentOutputResult = _1.commitmentOutput.commitmentOutputTapscript(poolId, publicKey, isAddLiquidity);
                tapTweakedResult = commitmentOutputResult.taprootResult.tweak.hex;
                tapTweakedResultPrefix = tapTweakedResult.substring(0, 2);
                return [2 /*return*/, {
                        tapTweakedResultPrefix: tapTweakedResultPrefix,
                        cmtTxLocktimeByteLength: cmtTxLocktimeByteLength,
                        outputCount: outputCount,
                        inputCount: inputCount,
                        inputs: inputs,
                        outputs: outputs,
                        nsequenceValue: nsequenceValue,
                        cmtTxInOutpoints: cmtTxInOutpoints,
                        cmtOutput1Value: cmtOutput1Value,
                        output2PairValue: output2PairValue,
                        cmtOutput2Value: cmtOutput2Value,
                        cmtOutput3Value: cmtOutput3Value,
                        cmtOutputFeeHexValue: cmtOutputFeeHexValue,
                        cmtOutput3PairValue: cmtOutput3PairValue,
                        cmtOutput3Asset: cmtOutput3Asset,
                        changeOutputFinal: changeOutputFinal,
                        seperatedChangeOutputs: seperatedChangeOutputs,
                        poolId: poolId,
                        methodCall: methodCall,
                        publicKey: publicKey,
                        slippageTolerance: slippageTolerance,
                        orderingFee: orderingFee,
                        cmtOutput1: cmtOutput1,
                        cmtOutput2: cmtOutput2,
                        cmtOutput3: cmtOutput3,
                        transaction: transaction,
                        pool: pool,
                    }];
        }
    });
}); };
exports.commitmentFinder = commitmentFinder;
//# sourceMappingURL=commitmentFinder.js.map