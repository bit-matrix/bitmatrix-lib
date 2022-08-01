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
const models_1 = require("@bitmatrix/models");
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const lib_core_1 = require("@script-wiz/lib-core");
const commitmentOutput_1 = require("./commitmentOutput");
const ldk_1 = require("./ldk");
const helper_1 = require("./utils/helper");
const case1 = (wallet, inputAmount, calculatedAmountWithSlippage, pool, config, publicKey) => {
    const methodCall = models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    console.log("receivedAmount", receivedAmount);
    // Call data OP_RETURN
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    const receipents = [
        {
            value: totalFee,
            address,
            asset: pool.quote.assetHash,
        },
        {
            value: inputAmount,
            address,
            asset: pool.quote.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case1 = case1;
const case2 = (wallet, inputAmount, calculatedAmountWithSlippage, pool, config, publicKey) => {
    const methodCall = models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    // Call data OP_RETURN
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    const receipents = [
        {
            value: totalFee,
            address,
            asset: pool.quote.assetHash,
        },
        {
            value: inputAmount,
            address,
            asset: pool.token.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case2 = case2;
const case3 = (wallet, inputAmountPair1, inputAmountPair2, pool, config, publicKey) => {
    const methodCall = models_1.CALL_METHOD.ADD_LIQUIDITY;
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = (0, wiz_data_1.hexLE)((0, helper_1.calculateAmountTotal)(inputAmountPair1, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    // const receivedAmountNumber = inputAmountPair1 + config.defaultOrderingFee.number + config.baseFee.number + config.serviceFee.number;
    // Call data OP_RETURN
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey, true).taprootResult.address.testnet;
    const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    const receipents = [
        {
            value: totalFee,
            address,
            asset: pool.quote.assetHash,
        },
        {
            value: inputAmountPair1,
            address,
            asset: pool.quote.assetHash,
        },
        {
            value: inputAmountPair2,
            address,
            asset: pool.token.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case3 = case3;
const case4 = (wallet, lpAmount, pool, config, publicKey) => {
    const methodCall = models_1.CALL_METHOD.REMOVE_LIQUIDITY;
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = (0, wiz_data_1.hexLE)((0, helper_1.calculateAmountTotal)(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    // Call data OP_RETURN
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const address = (0, commitmentOutput_1.commitmentOutputTapscript)(pool.id, publicKey).taprootResult.address.testnet;
    const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;
    const receipents = [
        {
            value: totalFee,
            address,
            asset: pool.quote.assetHash,
        },
        {
            value: lpAmount,
            address,
            asset: pool.lp.assetHash,
        },
    ];
    return (0, ldk_1.signTx)(wallet, callData, receipents);
};
exports.case4 = case4;
//# sourceMappingURL=commitmentSign.js.map