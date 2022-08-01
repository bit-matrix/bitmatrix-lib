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
exports.calculateAssetId = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_core_1 = require("@script-wiz/lib-core");
var calculateAssetId = function (txId, contractHash, vout) {
    var voutWiz = wiz_data_1.default.fromNumber(vout);
    var vout4Byte = lib_core_1.convertion.numToLE32(voutWiz).hex;
    var outpoint = (0, wiz_data_1.hexLE)(txId) + vout4Byte;
    var midstatePreimage = lib_core_1.crypto.hash256(wiz_data_1.default.fromHex(outpoint)).toString() + (0, wiz_data_1.hexLE)(contractHash);
    var entropy = lib_core_1.sha256d.sha256Midstate(midstatePreimage);
    var assetId = (0, wiz_data_1.hexLE)(lib_core_1.sha256d.sha256Midstate(entropy.toString("hex") + "0000000000000000000000000000000000000000000000000000000000000000").toString("hex"));
    return assetId;
};
exports.calculateAssetId = calculateAssetId;
//# sourceMappingURL=asset.js.map