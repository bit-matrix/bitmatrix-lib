import WizData, { hexLE } from "@script-wiz/wiz-data";
import { crypto, taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";

export const createCommitmentOutput = (flagAssetId: string, pubkey: string, isAddLiquidity = false) => {
  const flagAssetIdLe = hexLE(flagAssetId);
  const caseStaticValue = isAddLiquidity ? "51" : "00";

  const commitmentOutput =
    caseStaticValue +
    "20" +
    flagAssetIdLe +
    "14" +
    crypto.hash160v2(WizData.fromHex(pubkey)) +
    "537a63757700c869876777766bd4d58804050000007600cb8851cb8800d14f8800a88851d100888800c86900ce698851c86951ce698800c96900cf698851c96951cf698800c7010088040100000088766b51c7010088d288886353d48852c70100880403000000886c8852d100886c8852c86952ce698852c96952cf698851cb52cb886752d48868d2040200000088d304000000008768";

  return commitmentOutput;
};

export const commitmentOutputTapscript = (flagAssetId: string, pubkey: string, isAddLiquidity?: boolean) => {
  const commitmentOutput = createCommitmentOutput(flagAssetId, pubkey, isAddLiquidity);
  const innerKey = WizData.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
  const taprootResult = taproot.tapRoot(innerKey, [WizData.fromHex(commitmentOutput)], TAPROOT_VERSION.LIQUID);

  return { taprootResult, commitmentOutput };
};
