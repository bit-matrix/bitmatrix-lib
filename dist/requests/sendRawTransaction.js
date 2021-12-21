"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRawTransaction = void 0;
var axios_1 = __importDefault(require("axios"));
var sendRawTransaction = function (param) {
    return axios_1.default
        .post("http://157.230.101.158:9485/rpc", JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "sendrawtransaction",
        params: [param],
    }), {
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(function (response) {
        return response.data.result;
    })
        .catch(function (err) {
        return err;
    });
};
exports.sendRawTransaction = sendRawTransaction;
//# sourceMappingURL=sendRawTransaction.js.map