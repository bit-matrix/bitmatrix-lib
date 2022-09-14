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
exports.calculateInitialLpCirculation = exports.poolDeploy = void 0;
var asset_1 = require("./asset");
var lib_core_1 = require("@script-wiz/lib-core");
var pool_1 = require("./pool");
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var helper_1 = require("./utils/helper");
var maxLpSupply = 2000000000;
var poolDeploy = function (txId, quoteAssetId, tokenAssetId, quoteAmount, tokenAmount, userPubkey, poolVersion, pair1Coefficient, feeAssetHash, lpFeeTierIndex) {
    var flagContractHash = "2c4b31700fd1a93f25db0a70037c38c812b61441d0aeb757824cbb1d366d3c23";
    var lpContractHash = "26842dfd877abe7ae07a7f925fe0223996a4d6f4233d3eca06dd72c8bb26eb75";
    var innerkey = wiz_data_1.default.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
    var prevTxId = (0, wiz_data_1.hexLE)(txId);
    var quoteAssetIdLE = (0, wiz_data_1.hexLE)(quoteAssetId);
    var newFlagAssetId = (0, asset_1.calculateAssetId)(txId, flagContractHash, 0);
    var newLpAssetId = (0, asset_1.calculateAssetId)(txId, lpContractHash, 1);
    var leafCount = 0;
    if (poolVersion === 1) {
        leafCount = 32;
    }
    var lpFeeTier = lpFeeTierIndex === 0 ? wiz_data_1.default.fromHex("00") : wiz_data_1.default.fromNumber(lpFeeTierIndex);
    var mainCovenantScriptPubkey = (0, pool_1.createCovenants)(leafCount - 1, 0, newFlagAssetId, pair1Coefficient, lpFeeTierIndex).taprootResult.scriptPubkey.hex;
    var flagScriptPubkey = "512070d3017ab2a8ae4cccdb0537a45fb4a3192bff79c49cf54bd9edd508dcc93f55";
    var lpHolderCovenantScript = "20" + (0, wiz_data_1.hexLE)(newFlagAssetId) + "00c86987";
    var lpHolderCovenantScriptPubkey = lib_core_1.taproot.tapRoot(innerkey, [wiz_data_1.default.fromHex(lpHolderCovenantScript)], lib_core_1.TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
    var tokenHolderCovenantScriptPubkey = lpHolderCovenantScriptPubkey;
    var lpPrecision = 5 * pair1Coefficient;
    //Initial LP supply
    var deployerLpAmount = (0, wiz_data_1.hexLE)(lib_core_1.convertion.convert64(wiz_data_1.default.fromNumber((0, helper_1.div)(quoteAmount, lpPrecision))).hex);
    var lpPoolInitialSupply = (0, wiz_data_1.hexLE)(lib_core_1.convertion.convert64(wiz_data_1.default.fromNumber(maxLpSupply - (0, helper_1.div)(quoteAmount, lpPrecision))).hex);
    var deployerScriptPubkey = "0014" + lib_core_1.crypto.hash160v2(wiz_data_1.default.fromHex(userPubkey));
    var poolSatsInitialSupply = (0, wiz_data_1.hexLE)(lib_core_1.convertion.convert64(wiz_data_1.default.fromNumber(quoteAmount)).hex);
    var poolTokensInitialSupply = (0, wiz_data_1.hexLE)(lib_core_1.convertion.convert64(wiz_data_1.default.fromNumber(tokenAmount)).hex);
    var deploymentTxFees = (0, wiz_data_1.hexLE)(lib_core_1.convertion.convert64(wiz_data_1.default.fromNumber(1000)).hex);
    var lookupKeyword = "6a0f6269746d6174726978";
    var finalResult = "02000000" +
        "01" +
        "04" +
        prevTxId +
        "00000080" +
        "00" +
        "ffffffff" +
        "0000000000000000000000000000000000000000000000000000000000000000" +
        "233c6d361dbb4c8257b7aed04114b612c8387c03700adb253fa9d10f70314b2c" +
        "01" +
        "0000000000000001" +
        "00" +
        prevTxId +
        "01000080" +
        "00" +
        "ffffffff" +
        "0000000000000000000000000000000000000000000000000000000000000000" +
        "75eb26bbc872dd06ca3e3d23f4d6a4963922e05f927f7ae07abe7a87fd2d8426" +
        "01" +
        "0000000077359400" +
        "00" +
        prevTxId +
        "02000000" +
        "00" +
        "ffffffff" +
        prevTxId +
        "03000000" +
        "00" +
        "ffffffff" +
        "07" +
        "01" +
        (0, wiz_data_1.hexLE)(newFlagAssetId) +
        "01" +
        "0000000000000001" +
        "00" +
        "22" +
        flagScriptPubkey +
        "01" +
        (0, wiz_data_1.hexLE)(tokenAssetId) +
        "01" +
        poolTokensInitialSupply +
        "00" +
        "22" +
        tokenHolderCovenantScriptPubkey +
        "01" +
        (0, wiz_data_1.hexLE)(newLpAssetId) +
        "01" +
        lpPoolInitialSupply +
        "00" +
        "22" +
        lpHolderCovenantScriptPubkey +
        "01" +
        quoteAssetIdLE + // it will be generic
        "01" +
        poolSatsInitialSupply +
        "00" +
        "22" +
        mainCovenantScriptPubkey +
        "01" +
        (0, wiz_data_1.hexLE)(newLpAssetId) +
        "01" +
        deployerLpAmount +
        "00" +
        "16" +
        deployerScriptPubkey +
        "01" +
        (0, wiz_data_1.hexLE)(feeAssetHash) +
        "01" +
        "0000000000000000" +
        "00" +
        "11" +
        lookupKeyword +
        wiz_data_1.default.fromNumber(poolVersion).hex +
        lib_core_1.convertion.convert32(wiz_data_1.default.fromNumber(pair1Coefficient)).hex +
        lpFeeTier.hex +
        "01" +
        (0, wiz_data_1.hexLE)(feeAssetHash) +
        "01" +
        deploymentTxFees +
        "00" +
        "00" +
        "00000000" +
        "000001" +
        "0151" +
        "00000001" +
        "0151" +
        "00000001" +
        "0151" +
        "00000001" +
        "0151" +
        "000000000000000000000000000000";
    return finalResult;
};
exports.poolDeploy = poolDeploy;
var calculateInitialLpCirculation = function (pair1Coefficient, pair1Amount) {
    var lpPrecision = 5 * pair1Coefficient;
    //Initial LP supply
    var deployerLpAmount = (0, helper_1.div)(pair1Amount, lpPrecision) / 100000000;
    return deployerLpAmount;
};
exports.calculateInitialLpCirculation = calculateInitialLpCirculation;
//# sourceMappingURL=poolDeployment.js.map