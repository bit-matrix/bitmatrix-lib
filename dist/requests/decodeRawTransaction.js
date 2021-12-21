"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRawTransaction = void 0;
var axios_1 = __importDefault(require("axios"));
var decodeRawTransaction = function (param) {
    return axios_1.default
        .post("http://157.230.101.158:9485/rpc", JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "decoderawtransaction",
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
exports.decodeRawTransaction = decodeRawTransaction;
//# sourceMappingURL=decodeRawTransaction.js.map