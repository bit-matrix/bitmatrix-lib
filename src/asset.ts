import WizData, { hexLE } from "@script-wiz/wiz-data";
import { convertion, crypto, sha256d } from "@script-wiz/lib-core";

export const calculateAssetId = (txId: string, contractHash: string, vout: number): string => {
  const voutWiz = WizData.fromNumber(vout);
  const vout4Byte = convertion.numToLE32(voutWiz).hex;

  const outpoint = hexLE(txId) + vout4Byte;

  const midstatePreimage = crypto.hash256(WizData.fromHex(outpoint)).toString() + hexLE(contractHash);

  const entropy = sha256d.sha256Midstate(midstatePreimage);

  const assetId = hexLE(sha256d.sha256Midstate(entropy.toString("hex") + "0000000000000000000000000000000000000000000000000000000000000000").toString("hex"));

  return assetId;
};
