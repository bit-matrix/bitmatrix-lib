"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPools = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const getPools = async () => {
    return axios_1.default
        .get(`${env_1.bmUrl}/pools`)
        .then((response) => {
        return response.data;
    })
        .catch((err) => {
        return err;
    });
};
exports.getPools = getPools;
//# sourceMappingURL=getPools.js.map