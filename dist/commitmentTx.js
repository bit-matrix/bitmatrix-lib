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
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const lib_core_1 = require("@script-wiz/lib-core");
const models_1 = require("@bitmatrix/models");
const calculateAmountTotal = (inputAmount, orderingFee, baseFee, serviceFee = 0) => {
    const totalAmount = inputAmount + orderingFee + baseFee + serviceFee;
    const totalAmount64 = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(totalAmount)).hex;
    const totalAmount64BE = (0, wiz_data_1.hexLE)(totalAmount64);
    return totalAmount64BE;
};
const quoteToTokenCreateCommitmentTx = (inputAmount, txId, publicKey, calculatedAmountWithSlippage, config, pool) => {
    const methodCall = models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    const quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    const constLength = "020000000102";
    const rpcTxId = (0, wiz_data_1.hexLE)(txId);
    const constLength2 = "0000000000ffffffff";
    const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    const constLength4 = "01" + quoteAssetIdLE + "01";
    const inputMod2 = inputAmount % 2;
    const ctxOutput1 = calculateAmountTotal(inputAmount / 2 + inputMod2, config.defaultOrderingFee.number, config.baseFee.number + config.serviceFee.number);
    const constLength5 = "0022";
    const scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    const ctxOutput2 = "01" + quoteAssetIdLE + "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(inputAmount / 2)).hex) + "0022";
    const constLength7 = "01" + quoteAssetIdLE + "01";
    const commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    const commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    const constLength8 = "00007ba513000000010151000000010151000000000000000000";
    const commitmentTransactionRaw = constLength +
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
const tokenToQuoteCreateCommitmentTx = (inputAmount, txId, publicKey, calculatedAmountWithSlippage, config, pool) => {
    const methodCall = models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    const quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    const constLength = "020000000102";
    const rpcTxId = (0, wiz_data_1.hexLE)(txId);
    const constLength2 = "0000000000ffffffff";
    const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    const constLength4 = "01" + quoteAssetIdLE + "01";
    const feeAmountsTotal = calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);
    const constLength5 = "0022";
    const scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    const tokenAssetIdLE = (0, wiz_data_1.hexLE)(pool.token.assetHash);
    const constLength6 = "01" + tokenAssetIdLE + "01";
    const inputAmount64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(inputAmount)).hex;
    const inputAmount64BE = (0, wiz_data_1.hexLE)(inputAmount64LE);
    const constLength7 = "0022";
    const constLength8 = "01" + quoteAssetIdLE + "01";
    const commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    const commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    const constLength9 = "00007ba513000000010151000000010151000000000000000000";
    const commitmentTransactionRaw = constLength +
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
const liquidityAddCreateCommitmentTx = (quoteAmount, tokenAmount, txId, publicKey, config, pool) => {
    const methodCall = models_1.CALL_METHOD.ADD_LIQUIDITY;
    const quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    const tokenAssetIdLE = (0, wiz_data_1.hexLE)(pool.token.assetHash);
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = (0, wiz_data_1.hexLE)(calculateAmountTotal(quoteAmount, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    const constLength = "020000000102";
    const rpcTxId = (0, wiz_data_1.hexLE)(txId);
    const constLength2 = "0000000000ffffffff";
    const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    const constLength4 = "01" + quoteAssetIdLE + "01";
    const inputAmountTotal = calculateAmountTotal(quoteAmount, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);
    const constLength5 = "0022";
    const scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    const constLength6 = "01" + tokenAssetIdLE + "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(tokenAmount)).hex) + "0022";
    const constLength7 = "01" + quoteAssetIdLE + "01";
    const commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    const commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    const constLength8 = "00007ba513000000010151000000010151000000000000000000";
    const commitmentTransactionRaw = constLength +
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
const liquidityRemoveCreateCommitmentTx = (lpAmount, txId, publicKey, config, pool) => {
    const methodCall = models_1.CALL_METHOD.REMOVE_LIQUIDITY;
    const quoteAssetIdLE = (0, wiz_data_1.hexLE)(pool.quote.assetHash);
    const lpAssetIdLE = (0, wiz_data_1.hexLE)(pool.lp.assetHash);
    const poolIdLE = (0, wiz_data_1.hexLE)(pool.id);
    const receivedAmount = (0, wiz_data_1.hexLE)(calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
    const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
    const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";
    const constLength = "020000000102";
    const rpcTxId = (0, wiz_data_1.hexLE)(txId);
    const constLength2 = "0000000000ffffffff";
    const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";
    const constLength4 = "01" + quoteAssetIdLE + "01";
    const inputAmountTotal = calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);
    const constLength5 = "0022";
    const scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(config.innerPublicKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    const constLength6 = "01" + lpAssetIdLE + "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(lpAmount)).hex) + "0022";
    const constLength7 = "01" + quoteAssetIdLE + "01";
    const commitmentTxFee64LE = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(config.commitmentTxFee.number)).hex;
    const commitmentTxFee64BE = (0, wiz_data_1.hexLE)(commitmentTxFee64LE);
    const constLength8 = "00007ba513000000010151000000010151000000000000000000";
    const commitmentTransactionRaw = constLength +
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