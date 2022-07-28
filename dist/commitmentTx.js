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
exports.liquidityRemoveCreateCommitmentTx = exports.liquidityAddCreateCommitmentTx = exports.tokenToQuoteCreateCommitmentTx = exports.quoteToTokenCreateCommitmentTx = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_core_1 = require("@script-wiz/lib-core");
var models_1 = require("@bitmatrix/models");
var calculateAmountTotal = function (inputAmount, orderingFee, baseFee, serviceFee) {
    if (serviceFee === void 0) { serviceFee = 0; }
    var totalAmount = inputAmount + orderingFee + baseFee + serviceFee;
    var totalAmount64 = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(totalAmount)).hex;
    var totalAmount64BE = (0, wiz_data_1.hexLE)(totalAmount64);
    return totalAmount64BE;
};
var quoteToTokenCreateCommitmentTx = function (inputAmount, txId, publicKey, calculatedAmountWithSlippage, config, pool) {
    var methodCall = models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    var constLength4 = "01" + quoteAssetIdLE + "01";
    var inputMod2 = inputAmount % 2;
    var ctxOutput1 = calculateAmountTotal(inputAmount / 2 + inputMod2, config.defaultOrderingFee.number, config.baseFee.number + config.serviceFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    var ctxOutput2 = "01" + quoteAssetIdLE + "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(inputAmount / 2)).hex) + "0022";
    var constLength7 = "01" + quoteAssetIdLE + "01";
    var commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    var commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    var constLength8 = "00007ba513000000010151000000010151000000000000000000";
    var commitmentTransactionRaw = constLength +
        rpcTxId +
        constLength2 +
        rpcTxId +
        constLength3 +
        callData +
        constLength4 +
        ctxOutput1 +
        constLength5 +
        scriptPubKey +
        ctxOutput2 +
        scriptPubKey +
        constLength7 +
        commitmentTxFee64BE +
        constLength8;
    return commitmentTransactionRaw;
};
exports.quoteToTokenCreateCommitmentTx = quoteToTokenCreateCommitmentTx;
var tokenToQuoteCreateCommitmentTx = function (inputAmount, txId, publicKey, calculatedAmountWithSlippage, config, pool) {
    var methodCall = models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    var constLength4 = "01" + quoteAssetIdLE + "01";
    var feeAmountsTotal = calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    var tokenAssetIdLE = (0, wiz_data_1.hexLE)(pool.token.assetHash);
    var constLength6 = "01" + tokenAssetIdLE + "01";
    var inputAmount64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(inputAmount)).hex;
    var inputAmount64BE = (0, wiz_data_1.hexLE)(inputAmount64LE);
    var constLength7 = "0022";
    var constLength8 = "01" + quoteAssetIdLE + "01";
    var commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    var commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    var constLength9 = "00007ba513000000010151000000010151000000000000000000";
    var commitmentTransactionRaw = constLength +
        rpcTxId +
        constLength2 +
        rpcTxId +
        constLength3 +
        callData +
        constLength4 +
        feeAmountsTotal +
        constLength5 +
        scriptPubKey +
        constLength6 +
        inputAmount64BE +
        constLength7 +
        scriptPubKey +
        constLength8 +
        commitmentTxFee64BE +
        constLength9;
    return commitmentTransactionRaw;
};
exports.tokenToQuoteCreateCommitmentTx = tokenToQuoteCreateCommitmentTx;
var liquidityAddCreateCommitmentTx = function (quoteAmount, tokenAmount, txId, publicKey, config, pool) {
    var methodCall = models_1.CALL_METHOD.ADD_LIQUIDITY;
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    var tokenAssetIdLE = (0, wiz_data_1.hexLE)(pool.token.assetHash);
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = (0, wiz_data_1.hexLE)(calculateAmountTotal(quoteAmount, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    var constLength4 = "01" + quoteAssetIdLE + "01";
    var inputAmountTotal = calculateAmountTotal(quoteAmount, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    var constLength6 = "01" + tokenAssetIdLE + "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(tokenAmount)).hex) + "0022";
    var constLength7 = "01" + quoteAssetIdLE + "01";
    var commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    var commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    var constLength8 = "00007ba513000000010151000000010151000000000000000000";
    var commitmentTransactionRaw = constLength +
        rpcTxId +
        constLength2 +
        rpcTxId +
        constLength3 +
        callData +
        constLength4 +
        inputAmountTotal +
        constLength5 +
        scriptPubKey +
        constLength6 +
        scriptPubKey +
        constLength7 +
        commitmentTxFee64BE +
        constLength8;
    return commitmentTransactionRaw;
};
exports.liquidityAddCreateCommitmentTx = liquidityAddCreateCommitmentTx;
var liquidityRemoveCreateCommitmentTx = function (lpAmount, txId, publicKey, config, pool) {
    var methodCall = models_1.CALL_METHOD.REMOVE_LIQUIDITY;
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    var lpAssetIdLE = (0, wiz_data_1.hexLE)(pool.lp.assetHash);
    var poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    var receivedAmount = (0, wiz_data_1.hexLE)(calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    var callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    var constLength4 = "01" + quoteAssetIdLE + "01";
    var inputAmountTotal = calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    var constLength6 = "01" + lpAssetIdLE + "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(lpAmount)).hex) + "0022";
    var constLength7 = "01" + quoteAssetIdLE + "01";
    var commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    var commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    var constLength8 = "00007ba513000000010151000000010151000000000000000000";
    var commitmentTransactionRaw = constLength +
        rpcTxId +
        constLength2 +
        rpcTxId +
        constLength3 +
        callData +
        constLength4 +
        inputAmountTotal +
        constLength5 +
        scriptPubKey +
        constLength6 +
        scriptPubKey +
        constLength7 +
        commitmentTxFee64BE +
        constLength8;
    return commitmentTransactionRaw;
};
exports.liquidityRemoveCreateCommitmentTx = liquidityRemoveCreateCommitmentTx;
//# sourceMappingURL=commitmentTx.js.map