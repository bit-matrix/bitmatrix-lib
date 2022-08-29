"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitmentFinder = void 0;
var sha256streaming_1 = __importDefault(require("@bitmatrix/sha256streaming"));
var lib_core_1 = require("@script-wiz/lib-core");
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var _1 = require(".");
var helper_1 = require("./utils/helper");
var commitmentFinder = function (transaction, pools) { return __awaiter(void 0, void 0, void 0, function () {
    var rawTransactionHex, decodedTransaction, outputs, inputs, outputCount, opReturnOutput, locktimeHex, callData, poolId, pool, methodCall, publicKey, slippageTolerance, orderingFee, cmtOutput1, cmtOutput2, cmtOutput3, baseTransaction, replacedBaseTransaction, contextInput, sha256InitializeResult, sha256InitializeResultLength, part1, part2, part3, commitmentOutputResult, tapTweakedResult, tweakKeyPrefix;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _1.api.getRawTransaction(transaction.txid)];
            case 1:
                rawTransactionHex = _a.sent();
                return [4 /*yield*/, _1.api.decodeRawTransaction(rawTransactionHex)];
            case 2:
                decodedTransaction = _a.sent();
                outputs = decodedTransaction.vout;
                inputs = decodedTransaction.vin;
                outputCount = wiz_data_1.default.fromNumber(outputs.length);
                opReturnOutput = outputs[outputs.length - 1].scriptPubKey.asm.split(" ");
                if (opReturnOutput[0] !== "OP_RETURN")
                    return [2 /*return*/, undefined];
                if (decodedTransaction.locktime !== 0)
                    return [2 /*return*/, undefined];
                locktimeHex = lib_core_1.convertion.numToLE32(wiz_data_1.default.fromNumber(decodedTransaction.locktime)).hex;
                callData = opReturnOutput[1];
                if (callData.length !== 156)
                    return [2 /*return*/, undefined];
                poolId = (0, wiz_data_1.hexLE)(callData.substring(0, 64));
                pool = pools.find(function (p) {
                    return p.id === poolId && p.active;
                });
                if (!pool)
                    return [2 /*return*/, undefined];
                methodCall = callData.substring(64, 66);
                publicKey = callData.substring(66, 132);
                slippageTolerance = callData.substring(132, 148);
                orderingFee = callData.substring(148, 156);
                cmtOutput1 = outputs[0];
                cmtOutput2 = outputs[1];
                if (methodCall === "03") {
                    cmtOutput3 = outputs[2];
                }
                if (cmtOutput1.asset !== helper_1.lbtcAssest)
                    return [2 /*return*/, undefined];
                baseTransaction = rawTransactionHex.split(callData)[0] + callData + locktimeHex;
                replacedBaseTransaction = (0, helper_1.replaceChar)(baseTransaction, 9, "0");
                contextInput = replacedBaseTransaction.slice(0, -8);
                sha256InitializeResult = sha256streaming_1.default.sha256Initializer(contextInput).toLowerCase();
                sha256InitializeResultLength = sha256InitializeResult.length;
                if (sha256InitializeResultLength <= 80 && sha256InitializeResultLength >= 206)
                    return [2 /*return*/, undefined];
                part1 = sha256InitializeResult.substring(0, 80);
                part2 = sha256InitializeResult.substring(80);
                part3 = callData.substring(0, 156 - part2.length);
                commitmentOutputResult = _1.commitmentOutput.commitmentOutputTapscript(poolId, publicKey);
                tapTweakedResult = commitmentOutputResult.taprootResult.tweak.hex;
                tweakKeyPrefix = tapTweakedResult.substring(0, 2);
                return [2 /*return*/, {
                        tweakKeyPrefix: tweakKeyPrefix,
                        part1: part1,
                        part2: part2,
                        part3: part3,
                        locktimeHex: locktimeHex,
                        outputCount: outputCount,
                        inputs: inputs,
                        outputs: outputs,
                        poolId: poolId,
                        methodCall: methodCall,
                        publicKey: publicKey,
                        slippageTolerance: slippageTolerance,
                        orderingFee: orderingFee,
                        cmtOutput1: cmtOutput1,
                        cmtOutput2: cmtOutput2,
                        cmtOutput3: cmtOutput3,
                        transaction: transaction,
                    }];
        }
    });
}); };
exports.commitmentFinder = commitmentFinder;
//# sourceMappingURL=commitmentFinder.js.map