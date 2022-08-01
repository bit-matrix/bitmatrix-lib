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
exports.calculateAmountTotal = exports.uniqueArray = exports.div = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const div = (input1, input2) => Math.floor(input1 / input2);
exports.div = div;
const uniqueArray = (data) => {
    return data.filter(function (item, pos) {
        return data.indexOf(item) == pos;
    });
};
exports.uniqueArray = uniqueArray;
const calculateAmountTotal = (inputAmount, orderingFee, baseFee, serviceFee = 0) => {
    const totalAmount = inputAmount + orderingFee + baseFee + serviceFee;
    const totalAmount64 = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(totalAmount)).hex;
    const totalAmount64BE = (0, wiz_data_1.hexLE)(totalAmount64);
    return totalAmount64BE;
};
exports.calculateAmountTotal = calculateAmountTotal;
//# sourceMappingURL=helper.js.map