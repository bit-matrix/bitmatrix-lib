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
exports.commitmentOutputTapscript = exports.createCommitmentOutput = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_core_1 = require("@script-wiz/lib-core");
var createCommitmentOutput = function (flagAssetId, pubkey, isAddLiquidity) {
    if (isAddLiquidity === void 0) { isAddLiquidity = false; }
    var flagAssetIdLe = (0, wiz_data_1.hexLE)(flagAssetId);
    var caseStaticValue = isAddLiquidity ? "51" : "00";
    var commitmentOutput = caseStaticValue +
        "20" +
        flagAssetIdLe +
        "14" +
        lib_core_1.crypto.hash160v2(wiz_data_1.default.fromHex(pubkey)) +
        "537a63757700c869876777766bd4d58804050000007600cb8851cb8800d14f8800a88851d100888800c86900ce698851c86951ce698800c96900cf698851c96951cf698800c7010088040100000088766b51c7010088d288886353d48852c70100880403000000886c8852d100886c8852c86952ce698852c96952cf698851cb52cb886752d48868d2040200000088d304000000008768";
    return commitmentOutput;
};
exports.createCommitmentOutput = createCommitmentOutput;
var commitmentOutputTapscript = function (flagAssetId, pubkey, isAddLiquidity) {
    var commitmentOutput = (0, exports.createCommitmentOutput)(flagAssetId, pubkey, isAddLiquidity);
    var innerKey = wiz_data_1.default.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
    var taprootResult = lib_core_1.taproot.tapRoot(innerKey, [wiz_data_1.default.fromHex(commitmentOutput)], lib_core_1.TAPROOT_VERSION.LIQUID);
    return { taprootResult: taprootResult, commitmentOutput: commitmentOutput };
};
exports.commitmentOutputTapscript = commitmentOutputTapscript;
//# sourceMappingURL=commitmentOutput.js.map