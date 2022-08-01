"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outPubKeysMap = exports.inputBlindingDataMap = void 0;
const ldk_1 = require("ldk");
function inputBlindingDataMap(pset, utxos) {
    const inputBlindingData = new Map();
    const txidToBuffer = function (txid) {
        return Buffer.from(txid, "hex").reverse();
    };
    let index = -1;
    for (const input of (0, ldk_1.psetToUnsignedTx)(pset).ins) {
        index++;
        const utxo = utxos.find((u) => txidToBuffer(u.txid).equals(input.hash) && u.vout === input.index);
        // only add unblind data if the prevout of the input is confidential
        if (utxo && utxo.unblindData && (0, ldk_1.isConfidentialOutput)(utxo.prevout)) {
            inputBlindingData.set(index, utxo.unblindData);
        }
    }
    return inputBlindingData;
}
exports.inputBlindingDataMap = inputBlindingDataMap;
function outPubKeysMap(pset, outputAddresses) {
    const outPubkeys = new Map();
    for (const outAddress of outputAddresses) {
        const index = outputIndexFromAddress(pset, outAddress);
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
    const utx = (0, ldk_1.psetToUnsignedTx)(tx);
    const recipientScript = ldk_1.address.toOutputScript(addressToFind);
    return utx.outs.findIndex((out) => out.script.equals(recipientScript));
}
const isConfidentialAddress = (addr) => {
    try {
        ldk_1.address.fromConfidential(addr);
        return true;
    }
    catch (ignore) {
        return false;
    }
};
const blindingKeyFromAddress = (addr) => {
    return ldk_1.address.fromConfidential(addr).blindingKey;
};
//# sourceMappingURL=utils.js.map