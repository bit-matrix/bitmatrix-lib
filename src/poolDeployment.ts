import { calculateAssetId } from "./asset";
import { taproot, TAPROOT_VERSION, convertion, crypto } from "@script-wiz/lib-core";
import { createCovenants } from "./pool";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import { div } from "./utils/helper";

const maxLpSupply = 2000000000;

export const poolDeploy = (txId: string, tokenAssetId: string, quoteAmount: number, tokenAmount: number, userPubkey: string, poolVersion: number, pair1Coefficient: number) => {
  const flagContractHash = "2c4b31700fd1a93f25db0a70037c38c812b61441d0aeb757824cbb1d366d3c23";
  const lpContractHash = "26842dfd877abe7ae07a7f925fe0223996a4d6f4233d3eca06dd72c8bb26eb75";
  const innerkey = WizData.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
  const prevTxId = hexLE(txId);

  const newFlagAssetId = calculateAssetId(txId, flagContractHash, 0);
  const newLpAssetId = calculateAssetId(txId, lpContractHash, 1);

  let leafCount = 0;

  if (poolVersion === 2) {
    leafCount = 15;
  }

  if (poolVersion === 3) {
    leafCount = 31;
  }

  if (poolVersion === 4) {
    leafCount = 63;
  }

  const mainCovenantScriptPubkey = createCovenants(leafCount, 0, newFlagAssetId).taprootResult.scriptPubkey.hex;

  const flagScriptPubkey = "512070d3017ab2a8ae4cccdb0537a45fb4a3192bff79c49cf54bd9edd508dcc93f55";
  const lpHolderCovenantScript = "20" + hexLE(newFlagAssetId) + "00c86987";

  const lpHolderCovenantScriptPubkey = taproot.tapRoot(innerkey, [WizData.fromHex(lpHolderCovenantScript)], TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
  const tokenHolderCovenantScriptPubkey = lpHolderCovenantScriptPubkey;

  const deployerLpAmount = hexLE(convertion.convert64(WizData.fromNumber(div(quoteAmount, 100))).hex);
  const lpPoolInitialSupply = hexLE(convertion.convert64(WizData.fromNumber(maxLpSupply - div(quoteAmount, 100))).hex);

  const deployerScriptPubkey = "0014" + crypto.hash160v2(WizData.fromHex(userPubkey));

  const poolSatsInitialSupply = hexLE(convertion.convert64(WizData.fromNumber(quoteAmount - (quoteAmount % 100))).hex);

  const poolTokensInitialSupply = hexLE(convertion.convert64(WizData.fromNumber(tokenAmount)).hex);

  const deploymentTxFees = hexLE(convertion.convert64(WizData.fromNumber(1000 + (quoteAmount % 100))).hex);

  const lookupKeyword = "6a0e6269746d6174726978"; // muz hash

  const finalResult =
    "02000000" +
    "01" +
    "04" +
    prevTxId +
    "00000080" +
    "00" +
    "ffffffff" +
    "0000000000000000000000000000000000000000000000000000000000000000" +
    "233c6d361dbb4c8257b7aed04114b612c8387c03700adb253fa9d10f70314b2c" +
    "01" +
    "0000000000000001" +
    "00" +
    prevTxId +
    "01000080" +
    "00" +
    "ffffffff" +
    "0000000000000000000000000000000000000000000000000000000000000000" +
    "75eb26bbc872dd06ca3e3d23f4d6a4963922e05f927f7ae07abe7a87fd2d8426" +
    "01" +
    "0000000077359400" +
    "00" +
    prevTxId +
    "02000000" +
    "00" +
    "ffffffff" +
    prevTxId +
    "03000000" +
    "00" +
    "ffffffff" +
    "07" +
    "01" +
    hexLE(newFlagAssetId) +
    "01" +
    "0000000000000001" +
    "00" +
    "22" +
    flagScriptPubkey +
    "01" +
    hexLE(tokenAssetId) +
    "01" +
    poolTokensInitialSupply +
    "00" +
    "22" +
    tokenHolderCovenantScriptPubkey +
    "01" +
    hexLE(newLpAssetId) +
    "01" +
    lpPoolInitialSupply +
    "00" +
    "22" +
    lpHolderCovenantScriptPubkey +
    "01" +
    "499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14" + // it will be generic
    "01" +
    poolSatsInitialSupply +
    "00" +
    "22" +
    mainCovenantScriptPubkey +
    "01" +
    hexLE(newLpAssetId) +
    "01" +
    deployerLpAmount +
    "00" +
    "16" +
    deployerScriptPubkey +
    "01" +
    "499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14" +
    "01" +
    "0000000000000000" +
    "00" +
    "10" +
    lookupKeyword +
    WizData.fromNumber(poolVersion).hex +
    convertion.convert32(WizData.fromNumber(pair1Coefficient)).hex +
    "01" +
    "499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14" +
    "01" +
    deploymentTxFees +
    "00" +
    "00" +
    "00000000" +
    "000001" +
    "0151" +
    "00000001" +
    "0151" +
    "00000001" +
    "0151" +
    "00000001" +
    "0151" +
    "000000000000000000000000000000";

  return finalResult;
};
