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
Object.defineProperty(exports, "__esModule", { value: true });
exports.case4 = exports.case3 = exports.case2 = exports.case1 = void 0;
var models_1 = require("@bitmatrix/models");
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_core_1 = require("@script-wiz/lib-core");
var commitmentOutput_1 = require("./commitmentOutput");
var ldk_1 = require("./ldk");
var helper_1 = require("./utils/helper");
var case1 = function (wallet, inputAmount, calculatedAmountWithSlippage, pool, config, publicKey) {
    var methodCall = models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    // Call data OP_RETURN
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    var totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    var receipents = [
        {
            value: totalFee,
            address: address,
            asset: helper_1.lbtcAssest,
        },
        {
            value: inputAmount,
            address: address,
            asset: pool.quote.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case1 = case1;
var case2 = function (wallet, inputAmount, calculatedAmountWithSlippage, pool, config, publicKey) {
    var methodCall = models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    // Call data OP_RETURN
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    var totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    var receipents = [
        {
            value: totalFee,
            address: address,
            asset: helper_1.lbtcAssest,
        },
        {
            value: inputAmount,
            address: address,
            asset: pool.token.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case2 = case2;
var case3 = function (wallet, inputAmountPair1, inputAmountPair2, pool, config, publicKey) {
    var methodCall = models_1.CALL_METHOD.ADD_LIQUIDITY;
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    // const receivedAmount = hexLE(calculateAmountTotal(inputAmountPair1, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    // const receivedAmountNumber = inputAmountPair1 + config.defaultOrderingFee.number + config.baseFee.number + config.serviceFee.number;
    var receivedAmount = "0000000000000000";
    // Call data OP_RETURN
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    var totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    var receipents = [
        {
            value: totalFee,
            address: address,
            asset: helper_1.lbtcAssest,
        },
        {
            value: inputAmountPair1,
            address: address,
            asset: pool.quote.assetHash,
        },
        {
            value: inputAmountPair2,
            address: address,
            asset: pool.token.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case3 = case3;
var case4 = function (wallet, lpAmount, pool, config, publicKey) {
    var methodCall = models_1.CALL_METHOD.REMOVE_LIQUIDITY;
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = (0, wiz_data_1.hexLE)((0, helper_1.calculateAmountTotal)(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    // Call data OP_RETURN
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    var totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    var receipents = [
        {
            value: totalFee,
            address: address,
            asset: helper_1.lbtcAssest,
        },
        {
            value: lpAmount,
            address: address,
            asset: pool.lp.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case4 = case4;
//# sourceMappingURL=commitmentSign.js.map