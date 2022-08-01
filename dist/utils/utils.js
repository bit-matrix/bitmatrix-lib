"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outPubKeysMap = exports.inputBlindingDataMap = void 0;
var ldk_1 = require("ldk");
function inputBlindingDataMap(pset, utxos) {
    var inputBlindingData = new Map();
    var txidToBuffer = function (txid) {
        return Buffer.from(txid, "hex").reverse();
    };
    var index = -1;
    var _loop_1 = function (input) {
        index++;
        var utxo = utxos.find(function (u) { return txidToBuffer(u.txid).equals(input.hash) && u.vout === input.index; });
        // only add unblind data if the prevout of the input is confidential
        if (utxo && utxo.unblindData && (0, ldk_1.isConfidentialOutput)(utxo.prevout)) {
            inputBlindingData.set(index, utxo.unblindData);
        }
    };
    for (var _i = 0, _a = (0, ldk_1.psetToUnsignedTx)(pset).ins; _i < _a.length; _i++) {
        var input = _a[_i];
        _loop_1(input);
    }
    return inputBlindingData;
}
exports.inputBlindingDataMap = inputBlindingDataMap;
function outPubKeysMap(pset, outputAddresses) {
    var outPubkeys = new Map();
    for (var _i = 0, outputAddresses_1 = outputAddresses; _i < outputAddresses_1.length; _i++) {
        var outAddress = outputAddresses_1[_i];
        var index = outputIndexFromAddress(pset, outAddress);
        if (index === -1)
            continue;
        if (isConfidentialAddress(outAddress)) {
            outPubkeys.set(index, blindingKeyFromAddress(outAddress));
        }
    }
    return outPubkeys;
}
exports.outPubKeysMap = outPubKeysMap;
function outputIndexFromAddress(tx, addressToFind) {
    var utx = (0, ldk_1.psetToUnsignedTx)(tx);
    var recipientScript = ldk_1.address.toOutputScript(addressToFind);
    return utx.outs.findIndex(function (out) { return out.script.equals(recipientScript); });
}
var isConfidentialAddress = function (addr) {
    try {
        ldk_1.address.fromConfidential(addr);
        return true;
    }
    catch (ignore) {
        return false;
    }
};
var blindingKeyFromAddress = function (addr) {
    return ldk_1.address.fromConfidential(addr).blindingKey;
};
//# sourceMappingURL=utils.js.map