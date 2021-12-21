"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBmConfigs = void 0;
var axios_1 = __importDefault(require("axios"));
var getBmConfigs = function () {
    axios_1.default
        .get("https://db.bitmatrix-aggregate.com/config/43a2f4ef8ce286e57ab3e39e6da3741382ba542854a1b28231a7a5b8ba337fcd")
        .then(function (response) {
        return response.data;
    })
        .catch(function (err) {
        return err;
    });
};
exports.getBmConfigs = getBmConfigs;
//# sourceMappingURL=getBmConfigs.js.map