"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.tokenToQuoteCreateCommitmentTx = exports.quoteToTokenCreateCommitmentTx = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_core_1 = require("@script-wiz/lib-core");
var models_1 = require("@bitmatrix/models");
var calculateAmountTotal = function (inputAmount, orderingFee, baseFee) {
    var totalAmount = inputAmount + orderingFee + baseFee;
    var totalAmount64 = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(totalAmount)).hex;
    var totalAmount64BE = (0, wiz_data_1.hexLE)(totalAmount64);
    return totalAmount64BE;
};
var quoteToTokenCreateCommitmentTx = function (inputAmount, txId, publicKey, calculatedAmountWithSlippage, config, quoteAssetId, poolId) {
    var methodCall = models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(quoteAssetId);
    var receivedAmount = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    var callData = (0, wiz_data_1.hexLE)(poolId) + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var commitmentOutputTapscriptTemplate = "20" + (0, wiz_data_1.hexLE)(poolId) + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    var constLength4 = "01" + quoteAssetIdLE + "01";
    var inputAmountTotal = calculateAmountTotal(inputAmount, config.defaultOrderingFee.number, config.baseFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubKey.hex;
    var constLength6 = "01" + quoteAssetIdLE + "01000000000000028a0022";
    var constLength7 = "01" + quoteAssetIdLE + "01";
    var commitmentTxFee64LE = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
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
exports.quoteToTokenCreateCommitmentTx = quoteToTokenCreateCommitmentTx;
var tokenToQuoteCreateCommitmentTx = function (inputAmount, txId, publicKey, tokenAssetId, quoteAssetId, calculatedAmountWithSlippage, config, poolId) {
    var methodCall = models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(quoteAssetId);
    var receivedAmount = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    var callData = (0, wiz_data_1.hexLE)(poolId) + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    var commitmentOutputTapscriptTemplate = "20" + (0, wiz_data_1.hexLE)(poolId) + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    var constLength4 = "01" + quoteAssetIdLE + "01";
    var feeAmountsTotal = calculateAmountTotal(config.serviceFee.number, config.defaultOrderingFee.number, config.baseFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubKey.hex;
    var tokenAssetIdLE = (0, wiz_data_1.hexLE)(tokenAssetId);
    var constLength6 = "01" + tokenAssetIdLE + "01";
    var inputAmount64LE = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(inputAmount)).hex;
    var inputAmount64BE = (0, wiz_data_1.hexLE)(inputAmount64LE);
    var constLength7 = "0022";
    var constLength8 = "01" + quoteAssetIdLE + "01";
    var commitmentTxFee64LE = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
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
//# sourceMappingURL=commitmentTx.js.map