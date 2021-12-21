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
exports.lbtcToTokenCreateCommitmentTx = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_core_1 = require("@script-wiz/lib-core");
var models_1 = require("@bitmatrix/models");
var env_1 = require("./env");
var calculateAmountTotal = function (inputAmount, orderingFee, baseFee) {
    var totalAmount = inputAmount + orderingFee + baseFee;
    var totalAmount64 = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(totalAmount)).hex;
    var totalAmount64BE = (0, wiz_data_1.hexLE)(totalAmount64);
    return totalAmount64BE;
};
var lbtcToTokenCreateCommitmentTx = function (inputAmount, txId, publicKey, calculatedAmountWithSlippage, orderingFee, baseFee, internalKey) {
    var methodCall = models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    var calculatedAmountWithSlippage64 = lib_core_1.conversion.numToLE64(wiz_data_1.default.fromNumber(calculatedAmountWithSlippage)).hex;
    var callData = env_1.targetAssetId + methodCall + publicKey + calculatedAmountWithSlippage64 + orderingFee.hex;
    var commitmentOutputTapscriptTemplate = "630401000000b200c86920" + env_1.targetAssetId + "876700c86920" + env_1.targetAssetId + "879169043c000000b221" + publicKey + "ac68";
    var constLength = "020000000102";
    var rpcTxId = (0, wiz_data_1.hexLE)(txId);
    var constLength2 = "0000000000ffffffff";
    var constLength3 = "0100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000000000516a4c4e";
    var constLength4 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401";
    var inputAmountTotal = calculateAmountTotal(inputAmount, orderingFee.number, baseFee.number);
    var constLength5 = "0022";
    var scriptPubKey = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(internalKey), [wiz_data_1.default.fromHex(commitmentOutputTapscriptTemplate)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubKey.hex;
    var constLength6 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000028a0022";
    var constLength7 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14010000000000000064";
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
        constLength8;
    // send raw transaction
    console.log(commitmentTransactionRaw);
    return commitmentTransactionRaw;
};
exports.lbtcToTokenCreateCommitmentTx = lbtcToTokenCreateCommitmentTx;
//# sourceMappingURL=commitmentTx.js.map