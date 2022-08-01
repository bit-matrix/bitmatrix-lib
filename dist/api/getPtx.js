"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPtx = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const getPtx = async (ctxId, poolId) => {
    return axios_1.default
        .get(`${env_1.bmUrl}/ptx/${poolId}/${ctxId}`)
        .then((response) => {
        return response.data;
    })
        .catch((err) => {
        return err;
    });
};
exports.getPtx = getPtx;
//# sourceMappingURL=getPtx.js.map