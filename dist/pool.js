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
exports.createCovenants = exports.bodyCalculaterN = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var lib_1 = require("@script-wiz/lib");
var lib_core_1 = require("@script-wiz/lib-core");
var bandwithArray = [
    145,
    355,
    630,
    970,
    1375,
    1845,
    2380,
    2980,
    3645,
    4375,
    5170,
    6030,
    6955,
    7945,
    9000,
    10120, // n = 15
];
var bodyCalculaterN = function (n, flagAssetId) {
    var body = "";
    var header = "";
    var reversedFlagAssetId = (0, wiz_data_1.hexLE)(flagAssetId);
    for (var i = 0; i <= n; i++) {
        var genericHeaderStart = "6b".repeat(i * 2);
        var genericHeaderEnd = "6c".repeat(i * 2);
        var headerStaticValue = "7e7e7e7e7e7c";
        var genericBody = "567a766e6e6eaa76" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c701008804010000008888" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c7010088040200000088888202a201885180528855517f5288012a557f0500ffffffff880153557f0500ffffffff880158517f5488028400547f04516a4c4e88028800014e7f76012080567988760120517f7c76012101217f7c760142587f7c014a547fe2e1577976518000c8697e51795101187f7e54797e7c0119527f7e5679a8767e01c47e015c7e7c7ea85579a8767e58797e7c7ea85a7a" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ca6976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ca69887e7c5879e46c6c5279936b51797651a2696ea0636d6788" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c76d5880" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 2).hex) +
            "c76d5880dd6968527aa9" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "d1008888" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c86953c869886c6c6c6c00cb76" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cb88" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cb88" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "d10088" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "d1008888567a765187637553c869" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c86988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c969" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c969d769557902bc0293e0d8697602f401e0df69766b7602f401e0da6977d8695179d76960e0da6977517960e0da6977537951c96953c969da69777651e0df6960e0d969da6977d9697cda697751c96953c969da69777651e0df6960e0d969d96952797cd86951c96953c969da69777651e0df690132e0d969d869567a5179dd637651c86976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ce6988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ce698852e0da6976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cf6988d769" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cf69887c6cd769527a527ad8697c6753c86976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ce6988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ce69886c52e0da6976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cf6988d769" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cf69887568677652876375" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c969557902bc0293e088" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c86951c86988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c9697651c96953c969da69777651e0df6902f401e0d969df69766b7602f401e0da6977d8695279d76951c96953c969da69777651e0df6960e0d969da6977517960e0da6977537951c96953c969da69777651e0df6960e0d969da6977d9697cda697760e0d96951797cd869567a5179dd637652e0da6953c86976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ce6988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ce698876" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cf6988d769" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cf6988d869517a6cd7697c6751c86976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ce6988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ce69886c52e0da6976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cf6988d769" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cf69887568677653876375" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c969557902bc0293e0d8697602e803e0df697660e0da69770400943577e05579d869766bd969527960e0da6977da6977" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c86951c86988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c969760480f0fa02e0df697651c96953c969da69777651e0df6960e0d969da69776cd969557951c96953c969da69777651e0df6960e0d969da6977da6977527a6edf637767756852c86976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ce6988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ce69887652e0da6976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cf6988d769" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cf6988557a7cd869547a527ad769537a537ad769557a75677654876375" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "c969557902bc0293e088" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c86952c86988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "c969765ae0df69766b517960e0da6977d9690400943577e05479d869766bda697760e0d96976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "cf698853c869" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 4).hex) +
            "ce69886c6c766b547951c96953c969da69777651e0df6960e0d969da6977d9697cda697751c96953c969da69777651e0df6960e0d969d96976" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "ce6951ce6988" +
            (0, lib_1.compileData)(wiz_data_1.default.fromNumber(i + 5).hex) +
            "cf69886c557ad769547a527ad869537a537ad869557a75676a686868686b6b6b6b6b";
        body += genericBody;
        header += genericHeaderStart + headerStaticValue + genericHeaderEnd;
    }
    var headerPart1 = header;
    var headerPart2 = "20" +
        reversedFlagAssetId +
        "1b20766b6b6351b27500c8696c876700c8696c87916960b27521ac68201dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624105461704c6561662f656c656d656e747311546170547765616b2f656c656d656e747300c869557988cd5388d4" +
        (0, lib_1.compileData)(wiz_data_1.default.fromNumber(2 * n + 6).hex) +
        "88d5" +
        (0, lib_1.compileData)(wiz_data_1.default.fromNumber(2 * n + 8).hex) +
        "8853c9696b51c9696b52c9696b006b04ffffff7f6b";
    var finalHeader = headerPart1 + headerPart2;
    var footer = "6d6d756c756ce0" +
        (0, lib_1.compileData)(wiz_data_1.default.fromNumber(bandwithArray[n]).hex) +
        "e0d769d58c767676cf69547a88d14f8800a888ce6953ce69888c76d1008814972ca4efa6bac21a771259e77dafabeeb0acbfe088ce6953ce69886c52cf69886c51cf69886c53cf698800ca6900d1698851ca6951d1698852ca6952d1698853ca6953d1698800c86900ce698851c86951ce698852c86952ce698853c86953ce6988040100000076767600cb8851cb8852cb8853cb88d2040200000088d3040000000087";
    return finalHeader + body + footer;
};
exports.bodyCalculaterN = bodyCalculaterN;
var createCovenants = function (leafCount, lookupLeafIndex, flagAssetId) {
    var mainCovenantScript = [];
    for (var i = 0; i <= leafCount; i++) {
        mainCovenantScript.push((0, exports.bodyCalculaterN)(i, flagAssetId));
    }
    var pubKey = wiz_data_1.default.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
    var scriptsWizData = mainCovenantScript.map(function (mcs) { return wiz_data_1.default.fromHex(mcs); });
    var controlBlock = lib_core_1.taproot.controlBlockCalculation(scriptsWizData, "c4", pubKey.hex, lookupLeafIndex);
    var taprootResult = lib_core_1.taproot.tapRoot(pubKey, scriptsWizData, lib_core_1.TAPROOT_VERSION.LIQUID);
    return { mainCovenantScript: mainCovenantScript, controlBlock: controlBlock, taprootResult: taprootResult };
};
exports.createCovenants = createCovenants;
//# sourceMappingURL=pool.js.map