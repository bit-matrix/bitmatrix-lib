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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitmentFinder = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const _1 = require(".");
const lbtcAssest = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";
const commitmentFinder = async (transaction, pools) => {
    // fetch tx details with rpc
    const rawTransactionHex = await _1.api.getRawTransaction(transaction.txid);
    const decodedTransaction = await _1.api.decodeRawTransaction(rawTransactionHex);
    //tx outputs
    const outputs = decodedTransaction.vout;
    if (outputs.length > 8 && outputs.length < 4)
        return undefined;
    const outputCount = wiz_data_1.default.fromNumber(outputs.length);
    //tx inputs
    const inputs = decodedTransaction.vin;
    if (inputs.length > 12)
        return undefined;
    const inputCount = wiz_data_1.default.fromNumber(inputs.length);
    //cmt txin locktime’ı 4_bytes return
    const cmtTxLocktimeByteLength = lib_core_1.convertion.numToLE32(wiz_data_1.default.fromNumber(decodedTransaction.locktime)).hex;
    const cmtTxInOutpoints = inputs.map((inp, index) => {
        const vout32Byte = lib_core_1.convertion.numToLE32(wiz_data_1.default.fromNumber(inp.vout));
        return { index, data: (0, wiz_data_1.hexLE)(inp.txid) + vout32Byte.hex };
    });
    const nSequences = inputs.map((inp) => inp.sequence);
    //Every nsequence must equal
    if (nSequences.every((ns) => ns !== nSequences[0]))
        return undefined;
    const nsequenceValue = nSequences[0].toString(16);
    const opReturnOutput = outputs[0].scriptPubKey.asm.split(" ");
    if (opReturnOutput[0] !== "OP_RETURN")
        return undefined;
    const opReturnOutputScriptHex = opReturnOutput[1];
    //poolIdLE (64)
    const poolId = (0, wiz_data_1.hexLE)(opReturnOutputScriptHex.substring(0, 64));
    const pool = pools.find((p) => {
        return p.id === poolId && p.active;
    });
    if (!pool)
        return undefined;
    //methodCall (2)
    const methodCall = opReturnOutputScriptHex.substring(64, 66);
    // public key (66)
    const publicKey = opReturnOutputScriptHex.substring(66, 132);
    // slippageTolerance / amount (16)
    const slippageTolerance = opReturnOutputScriptHex.substring(132, 148);
    //orderingFees (8)
    const orderingFee = opReturnOutputScriptHex.substring(148, 156);
    const cmtOutput1 = outputs[1];
    const cmtOutput2 = outputs[2];
    let changeOutputs = [];
    let cmtOutput3;
    if (outputCount.number) {
        let i = 3;
        if (methodCall === "03") {
            i = 4;
            cmtOutput3 = outputs[3];
        }
        for (i; i < outputCount.number - 1; i++) {
            changeOutputs.push(outputs[i]);
        }
    }
    // 6. Commitment out 1 (Calldatadan hemen sonraki output)’in taşıdığı L-BTC değeri 8 byte LE olarak.
    if (cmtOutput1.asset !== lbtcAssest)
        Promise.reject("Asset must be L-BTC");
    const cmtOutput1Value = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutput1.value).mul(100000000).toNumber())).hex;
    //   7. Commitment out 2 (Cmt out 1 hemen sonraki output)’nin taşıdığı asset idsi pair1_asset türünden ise 0x03, pair2_asset türünden ise 0x01.
    //const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/${poolId}`);
    //const poolDetail: Pool = poolReq.data;
    const pair1Asset = pool.quote.assetHash;
    const pair2Asset = pool.token.assetHash;
    let output2PairValue = "00";
    if (cmtOutput2.asset === pair2Asset)
        output2PairValue = "01";
    if (cmtOutput2.asset === pair1Asset)
        output2PairValue = "03";
    if (methodCall === "04")
        output2PairValue = "02";
    //   8. Commitment out 2 ’in taşıdığı asset değeri 8 byte LE olarak.
    if (cmtOutput2.value === undefined)
        Promise.reject("Commitment Output Value musn't be confidential.");
    const cmtOutput2Value = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutput2.value).mul(100000000).toNumber())).hex;
    //   9. Commitment out 3 ’ün taşıdığı asset id si pair1_asset türünden ise 0x03, pair2_asset türünden ise 0x01. (bu sadece case 3’ de var, eğer başka bir case ise empty 0x)
    //   10. Commitment out 3 ’in taşıdığı asset değeri
    let cmtOutput3PairValue = "00";
    let cmtOutput3Value;
    let cmtOutput3Asset;
    if (methodCall === "03" && cmtOutput3) {
        if (cmtOutput3.asset === pair2Asset)
            cmtOutput3PairValue = "01";
        if (cmtOutput3.asset === pair1Asset)
            cmtOutput3PairValue = "03";
        cmtOutput3Value = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutput3.value).mul(100000000).toNumber())).hex;
        cmtOutput3Asset = cmtOutput3.asset;
    }
    //cmt tx’in fee miktarı 8_bytes olacak
    const outputsLength = outputCount.number;
    const cmtOutputFeeValue = outputs[outputsLength - 1].value || 0;
    const cmtOutputFeeHexValue = "01" + lib_core_1.convertion.numToLE64LE(wiz_data_1.default.fromNumber(new decimal_js_1.default(cmtOutputFeeValue).mul(100000000).toNumber())).hex;
    const seperatedChangeOutputs = changeOutputs.map((co, index) => {
        if (co.asset) {
            return {
                index: index + 1,
                asset: "01" + (0, wiz_data_1.hexLE)(co.asset),
                value: "01" + (0, wiz_data_1.hexLE)(lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(new decimal_js_1.default(co.value).mul(100000000).toNumber())).hex),
                amount: "01" + lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(new decimal_js_1.default(co.value).mul(100000000).toNumber())).hex,
                nonce: "00",
                scriptpubkey: wiz_data_1.default.fromNumber(co.scriptPubKey.hex.length / 2).hex + co.scriptPubKey.hex,
            };
        }
        return {
            index: index + 1,
            asset: co.assetcommitment,
            value: co.valuecommitment,
            amount: co.valuecommitment,
            nonce: co.commitmentnonce,
            scriptpubkey: wiz_data_1.default.fromNumber(co.scriptPubKey.hex.length / 2).hex + co.scriptPubKey.hex,
        };
    });
    const changeOutputFinal = seperatedChangeOutputs.map((cof) => {
        return {
            index: cof.index,
            assetValue: cof.asset + cof.value,
            noncScpkey: cof.nonce + cof.scriptpubkey,
        };
    });
    let isAddLiquidity = false;
    let commitmentOutputResult = undefined;
    commitmentOutputResult = _1.commitmentOutput.commitmentOutputTapscript(poolId, publicKey, isAddLiquidity);
    const tapTweakedResult = commitmentOutputResult.taprootResult.tweak.hex;
    const tapTweakedResultPrefix = tapTweakedResult.substring(0, 2);
    return {
        tapTweakedResultPrefix,
        cmtTxLocktimeByteLength,
        outputCount,
        inputCount,
        inputs,
        outputs,
        nsequenceValue,
        cmtTxInOutpoints,
        cmtOutput1Value,
        output2PairValue,
        cmtOutput2Value,
        cmtOutput3Value,
        cmtOutputFeeHexValue,
        cmtOutput3PairValue,
        cmtOutput3Asset,
        changeOutputFinal,
        seperatedChangeOutputs,
        poolId,
        methodCall,
        publicKey,
        slippageTolerance,
        orderingFee,
        cmtOutput1,
        cmtOutput2,
        cmtOutput3,
        transaction,
        pool,
    };
};
exports.commitmentFinder = commitmentFinder;
//# sourceMappingURL=commitmentFinder.js.map