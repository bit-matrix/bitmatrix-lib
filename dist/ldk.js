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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTx = void 0;
const ldk_1 = require("ldk");
const liquidjs_lib_1 = require("liquidjs-lib");
const ecc = __importStar(require("tiny-secp256k1"));
const utils_1 = require("./utils/utils");
const helper_1 = require("./utils/helper");
const signTx = async (marina, callData, recipients) => {
    const coins = await marina.getCoins();
    // 1. create an empty psbt object
    const pset = new liquidjs_lib_1.Psbt({ network: liquidjs_lib_1.networks.testnet });
    // 2. add a custom OP_RETURN output to psbt
    pset.addOutput({
        script: liquidjs_lib_1.script.compile([liquidjs_lib_1.script.OPS.OP_RETURN, Buffer.from(callData, "hex")]),
        value: liquidjs_lib_1.confidential.satoshiToConfidentialValue(0),
        asset: liquidjs_lib_1.AssetHash.fromHex(liquidjs_lib_1.networks.testnet.assetHash, false).bytes,
        nonce: Buffer.alloc(0),
    });
    // 3. add P2TR address(es) as recipient(s) to psbt
    // 4. Serialize as base64 the psbt to be passed to LDK
    const tx = pset.toBase64();
    const makeGetter = makeAssetChangeGetter(marina);
    const assets = recipients.map((r) => r.asset);
    const uniquAssets = (0, helper_1.uniqueArray)(assets);
    //todo
    const changeAddressGetter = await makeGetter(uniquAssets);
    // 5. Craft the transaction with multiple outputs and add fee & change output to the psbt
    const unsignedTx = (0, ldk_1.craftMultipleRecipientsPset)({
        psetBase64: tx,
        unspents: coins,
        recipients,
        coinSelector: (0, ldk_1.greedyCoinSelector)(),
        changeAddressByAsset: changeAddressGetter,
        addFee: true,
    });
    // deserialize and inspect the transaction
    const ptx = liquidjs_lib_1.Psbt.fromBase64(unsignedTx);
    const inputBlindingMap = (0, utils_1.inputBlindingDataMap)(unsignedTx, coins);
    const outputBlindingMap = (0, utils_1.outPubKeysMap)(unsignedTx, [changeAddressGetter(liquidjs_lib_1.networks.testnet.assetHash), recipients[0].address]);
    await ptx.blindOutputsByIndex(liquidjs_lib_1.Psbt.ECCKeysGenerator(ecc), inputBlindingMap, outputBlindingMap);
    // 7. Sign the transaction's inputs with Marina
    const signedTx = await marina.signTransaction(ptx.toBase64());
    // 7. Broadcast the transaction to the network (need to ba added to Marina)
    const finalTx = liquidjs_lib_1.Psbt.fromBase64(signedTx);
    finalTx.finalizeAllInputs();
    const txFinal = await marina.broadcastTransaction(finalTx.extractTransaction().toHex());
    return txFinal.txid;
};
exports.signTx = signTx;
const makeAssetChangeGetter = (marina) => async (assets) => {
    const addresses = await Promise.all(assets.map((_) => marina.getNextChangeAddress()));
    return (asset) => {
        console.log(asset);
        const index = assets.findIndex((a) => a === asset);
        return addresses[index].confidentialAddress;
    };
};
//# sourceMappingURL=ldk.js.map