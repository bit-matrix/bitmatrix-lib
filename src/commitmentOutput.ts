import WizData, { hexLE } from "@script-wiz/wiz-data";
import { crypto, taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";

export const createCommitmentOutput = (flagAssetId: string, pubkey: string, isAddLiquidity = false) => {
  const flagAssetIdLe = hexLE(flagAssetId);
  
  //const caseStaticValue = isAddLiquidity ? "51" : "00"; 
  //No longer used

  const commitmentOutput =
    "00c86920" +
    flagAssetIdLe +
    "876351675ab276a914" +
    crypto.hash160v2(WizData.fromHex(pubkey)) +
    "88ac68";

  return commitmentOutput;
};

export const commitmentOutputTapscript = (flagAssetId: string, pubkey: string, isAddLiquidity?: boolean) => {
  const commitmentOutput = createCommitmentOutput(flagAssetId, pubkey, isAddLiquidity);
  const innerKey = WizData.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
  const taprootResult = taproot.tapRoot(innerKey, [WizData.fromHex(commitmentOutput)], TAPROOT_VERSION.LIQUID);

  const controlBlock = taproot.controlBlockCalculation([WizData.fromHex(commitmentOutput)], "c4", innerKey.hex, 0);

  return { taprootResult, commitmentOutput, controlBlock };
};
