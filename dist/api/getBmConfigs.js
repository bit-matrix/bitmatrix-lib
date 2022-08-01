"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBmConfigs = void 0;
const axios_1 = __importDefault(require("axios"));
const getBmConfigs = async () => {
    return axios_1.default
        .get("https://raw.githubusercontent.com/bit-matrix/bitmatrix-app-config/master/testnet.json")
        .then((response) => {
        return response.data;
    })
        .catch((err) => {
        return err;
    });
};
exports.getBmConfigs = getBmConfigs;
//# sourceMappingURL=getBmConfigs.js.map