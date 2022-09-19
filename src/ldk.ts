import { AddressInterface, ChangeAddressFromAssetGetter, craftMultipleRecipientsPset, greedyCoinSelector, RecipientInterface, UnblindedOutput } from "ldk";
import { AssetHash, confidential, networks, Psbt, script, address as liquidAddress } from "liquidjs-lib";
import { Wallet } from "./wallet";
import * as ecc from "tiny-secp256k1";
import { MarinaProvider } from "marina-provider";
import { inputBlindingDataMap, outPubKeysMap } from "./utils/utils";
import { uniqueArray } from "./utils/helper";

export const signTx = async (marina: Wallet, callData: string, recipients: RecipientInterface[], isTestnet = false): Promise<string> => {
  const coins = await marina.getCoins();

  // 1. create an empty psbt object
  const pset = new Psbt({ network: isTestnet ? networks.testnet : networks.liquid });
  const feeAsset = isTestnet ? networks.testnet.assetHash : networks.liquid.assetHash;

  // // 2. add a custom OP_RETURN output to psbt
  // pset.addOutput({
  //   script: script.compile([script.OPS.OP_RETURN, Buffer.from(callData, "hex")]),
  //   value: confidential.satoshiToConfidentialValue(0),
  //   asset: AssetHash.fromHex(networks.testnet.assetHash, false).bytes,
  //   nonce: Buffer.alloc(0),
  // });

  // 3. add P2TR address(es) as recipient(s) to psbt

  // 4. Serialize as base64 the psbt to be passed to LDK
  const tx = pset.toBase64();

  const makeGetter = makeAssetChangeGetter(marina as unknown as MarinaProvider);

  const assets = recipients.map((r) => r.asset);

  const uniqueAssets = uniqueArray(assets);

  //todo
  const changeAddressGetter = await makeGetter(uniqueAssets);

  // 5. Craft the transaction with multiple outputs and add fee & change output to the psbt
  const unsignedTx = craftMultipleRecipientsPset({
    psetBase64: tx,
    unspents: coins as UnblindedOutput[],
    recipients,
    coinSelector: greedyCoinSelector(),
    changeAddressByAsset: changeAddressGetter,
    addFee: true,
  });

  // deserialize and inspect the transaction
  const ptx = Psbt.fromBase64(unsignedTx);

  ptx.addOutput({
    script: script.compile([script.OPS.OP_RETURN, Buffer.from(callData, "hex")]),
    value: confidential.satoshiToConfidentialValue(0),
    asset: AssetHash.fromHex(feeAsset, false).bytes,
    nonce: Buffer.alloc(0),
  });

  const inputBlindingMap = inputBlindingDataMap(unsignedTx, coins);

  const outputBlindingMap = outPubKeysMap(unsignedTx, [changeAddressGetter(feeAsset), recipients[0].address]);

  await ptx.blindOutputsByIndex(Psbt.ECCKeysGenerator(ecc), inputBlindingMap, outputBlindingMap);

  // 7. Sign the transaction's inputs with Marina
  const signedTx = await marina.signTransaction(ptx.toBase64());

  // 7. Broadcast the transaction to the network (need to ba added to Marina)
  const finalTx = Psbt.fromBase64(signedTx);

  finalTx.finalizeAllInputs();
  
  const rawHex = finalTx.extractTransaction().toHex();

  try {
    const txFinal = await marina.broadcastTransaction(rawHex);
    return txFinal.txid;
  } catch(error:any) {
    console.debug(rawHex);
    throw error;
  }
};

const makeAssetChangeGetter =
  (marina: MarinaProvider) =>
  async (assets: Array<string>): Promise<ChangeAddressFromAssetGetter> => {
    const addresses = await Promise.all(assets.map((_) => marina.getNextChangeAddress()));

    return (asset: string) => {
      console.log(asset);
      const index = assets.findIndex((a) => a === asset);
      return addresses[index].confidentialAddress;
    };
  };
