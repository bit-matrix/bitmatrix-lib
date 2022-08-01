"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRawTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const sendRawTransaction = async (param) => {
    return axios_1.default
        .post(env_1.rpcUrl, JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "sendrawtransaction",
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
exports.sendRawTransaction = sendRawTransaction;
//# sourceMappingURL=sendRawTransaction.js.map