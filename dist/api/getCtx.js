"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCtx = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const getCtx = async (ctxId, poolId) => {
    return axios_1.default
        .get(`${env_1.bmUrl}/ctx/${poolId}/${ctxId}`)
        .then((response) => {
        return response.data;
    })
        .catch((err) => {
        return err;
    });
};
exports.getCtx = getCtx;
//# sourceMappingURL=getCtx.js.map