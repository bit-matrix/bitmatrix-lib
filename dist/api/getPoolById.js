"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolById = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const getPoolById = async (poolId) => {
    return axios_1.default
        .get(`${env_1.bmUrl}/pools/${poolId}`)
        .then((response) => {
        return response.data;
    })
        .catch((err) => {
        return err;
    });
};
exports.getPoolById = getPoolById;
//# sourceMappingURL=getPoolById.js.map