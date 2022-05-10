import { AddressInterface, craftMultipleRecipientsPset, greedyCoinSelector, UnblindedOutput } from "ldk";
import { AssetHash, confidential, networks, Psbt, script, address as liquidAddress } from "liquidjs-lib";
import { Wallet } from "./wallet";
import * as ecc from "tiny-secp256k1";

export const signTx = async (marina: Wallet, data: string, address: string): Promise<string> => {
  const coins = await marina.getCoins();

  const changeAddress = await marina.getNextChangeAddress();

  // 1. create an empty psbt object
  const pset = new Psbt({ network: networks.testnet });

  // 2. add a custom OP_RETURN output to psbt
  pset.addOutput({
    script: script.compile([script.OPS.OP_RETURN, Buffer.from(data, "hex")]),
    value: confidential.satoshiToConfidentialValue(0),
    asset: AssetHash.fromHex(networks.testnet.assetHash, false).bytes,
    nonce: Buffer.alloc(0),
  });

  // 3. add P2TR address(es) as recipient(s) to psbt
  const recipients = [
    {
      asset: networks.testnet.assetHash,
      value: 5000,
      //P2TR address
      address,
    },
  ];

  // 4. Serialize as base64 the psbt to be passed to LDK
  const tx = pset.toBase64();

  // 5. Craft the transaction with multiple outputs and add fee & change output to the psbt
  const unsignedTx = craftMultipleRecipientsPset({
    psetBase64: tx,
    unspents: coins as UnblindedOutput[],
    recipients,
    coinSelector: greedyCoinSelector(),
    changeAddressByAsset: (_: string) => changeAddress.confidentialAddress,
    addFee: true,
  });

  // deserialize and inspect the transaction
  const ptx = Psbt.fromBase64(unsignedTx);
  //console.log(decoded.TX.toHex());

  // here we sure we are adding only one input and assume the last is our.
  // In case transaction has input user adds (not marina) be sure to track it down
  const marinaInputIndex = ptx.data.inputs.length - 1;

  // last output is always the fee output and the one before it, is the marina change output.
  // keep in mind in case you manipulate transaction manually after calling craftMultipleRecipientsPset
  const marinaChangeOutputIndex = ptx.data.outputs.length - 2;

  // let's get bliding private first using the marina input script
  const blindPrivKey = await getBlindingKeyByScript(marina, ptx.data.inputs[marinaInputIndex].witnessUtxo!.script.toString("hex"));

  // create a map input index => blinding private key
  // we need this to unblind the utxo data
  const inputBlindingMap = new Map<number, Buffer>().set(marinaInputIndex, Buffer.from(blindPrivKey, "hex"));

  // create a map output index => blinding PUBLIC (!) key
  // this is needed to blind the marina change output
  const outputBlindingMap = new Map<number, Buffer>().set(
    marinaChangeOutputIndex,
    // this is the blinding publick key of the change output for marina
    liquidAddress.fromConfidential(changeAddress.confidentialAddress).blindingKey
  );

  await ptx.blindOutputsByIndex(Psbt.ECCKeysGenerator(ecc), inputBlindingMap, outputBlindingMap);

  // 7. Sign the transaction's inputs with Marina
  const signedTx = await marina.signTransaction(ptx.toBase64());

  // 8. Broadcast the transaction to the network (need to ba added to Marina)
  const finalTx = Psbt.fromBase64(signedTx);

  finalTx.finalizeAllInputs();

  const txFinal = await marina.broadcastTransaction(finalTx.extractTransaction().toHex());

  return txFinal.txid;
};

const getBlindingKeyByScript = async (marina: Wallet, script: string): Promise<string> => {
  try {
    // get addresses from marina
    const addresses = await marina.getAddresses();
    // find the address of the requested script
    let found: AddressInterface | undefined;

    addresses.forEach((addr: AddressInterface) => {
      const currentScript = liquidAddress.toOutputScript(addr.confidentialAddress).toString("hex");
      if (currentScript === script) {
        found = addr;
      }
    });

    if (!found) throw new Error("no blinding key for script " + script);
    return found.blindingPrivateKey;
  } catch (e) {
    throw e;
  }
};
