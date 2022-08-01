"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRawTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const decodeRawTransaction = async (param) => {
    return axios_1.default
        .post(env_1.rpcUrl, JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "decoderawtransaction",
        params: [param],
    }), {
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
        return response.data.result;
    })
        .catch((err) => {
        return err;
    });
};
exports.decodeRawTransaction = decodeRawTransaction;
//# sourceMappingURL=decodeRawTransaction.js.map