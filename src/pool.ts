import WizData, { hexLE } from "@script-wiz/wiz-data";
import { compileData } from "@script-wiz/lib";
import { taproot } from "@script-wiz/lib-core";

const bandwithArray = [
  145, // n = 0
  355, // n = 1
  630, // n = 2
  970, // n = 3
  1375, // n = 4
  1845, // n = 5
  2380, // n = 6
  2980, // n = 7
  3645, // n = 8
  4375, // n = 9
  5170, // n = 10
  6030, // n = 11
  6955, // n = 12
  7945, // n = 13
  9000, // n = 14
  10120, // n = 15
];

export const bodyCalculaterN = (n: number, flagAssetId: string) => {
  let body = "";
  let header = "";
  const reversedFlagAssetId = hexLE(flagAssetId);

  for (let i = 0; i <= n; i++) {
    const genericHeaderStart = "6b".repeat(i * 2);
    const genericHeaderEnd = "6c".repeat(i * 2);
    const headerStaticValue = "7e7e7e7e7e7c";

    const genericBody =
      "567a766e6e6eaa76" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c701008804010000008888" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c7010088040200000088888202a201885180528855517f5288012a557f0500ffffffff880153557f0500ffffffff880158517f5488028400547f04516a4c4e88028800014e7f76012080567988760120517f7c76012101217f7c760142587f7c014a547fe2e1577976518000c8697e51795101187f7e54797e7c0119527f7e5679a8767e01c47e015c7e7c7ea85579a8767e58797e7c7ea85a7a" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ca6976" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ca69887e7c5879e46c6c5279936b51797651a2696ea0636d6788" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c76d5880" +
      compileData(WizData.fromNumber(i + 2).hex) +
      "c76d5880dd6968527aa9" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "d1008888" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c86953c869886c6c6c6c00cb76" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cb88" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cb88" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "d10088" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "d1008888567a765187637553c869" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c86988" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c969" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c969d769557902bc0293e0d8697602f401e0df69766b7602f401e0da6977d8695179d76960e0da6977517960e0da6977537951c96953c969da69777651e0df6960e0d969da6977d9697cda697751c96953c969da69777651e0df6960e0d969d96952797cd86951c96953c969da69777651e0df690132e0d969d869567a5179dd637651c86976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ce6988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ce698852e0da6976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cf6988d769" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cf69887c6cd769527a527ad8697c6753c86976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ce6988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ce69886c52e0da6976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cf6988d769" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cf69887568677652876375" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c969557902bc0293e088" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c86951c86988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c9697651c96953c969da69777651e0df6902f401e0d969df69766b7602f401e0da6977d8695279d76951c96953c969da69777651e0df6960e0d969da6977517960e0da6977537951c96953c969da69777651e0df6960e0d969da6977d9697cda697760e0d96951797cd869567a5179dd637652e0da6953c86976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ce6988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ce698876" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cf6988d769" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cf6988d869517a6cd7697c6751c86976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ce6988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ce69886c52e0da6976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cf6988d769" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cf69887568677653876375" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c969557902bc0293e0d8697602e803e0df697660e0da69770400943577e05579d869766bd969527960e0da6977da6977" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c86951c86988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c969760480f0fa02e0df697651c96953c969da69777651e0df6960e0d969da69776cd969557951c96953c969da69777651e0df6960e0d969da6977da6977527a6edf637767756852c86976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ce6988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ce69887652e0da6976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cf6988d769" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cf6988557a7cd869547a527ad769537a537ad769557a75677654876375" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "c969557902bc0293e088" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c86952c86988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "c969765ae0df69766b517960e0da6977d9690400943577e05479d869766bda697760e0d96976" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "cf698853c869" +
      compileData(WizData.fromNumber(i + 4).hex) +
      "ce69886c6c766b547951c96953c969da69777651e0df6960e0d969da6977d9697cda697751c96953c969da69777651e0df6960e0d969d96976" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "ce6951ce6988" +
      compileData(WizData.fromNumber(i + 5).hex) +
      "cf69886c557ad769547a527ad869537a537ad869557a75676a686868686b6b6b6b6b";

    body += genericBody;

    header += genericHeaderStart + headerStaticValue + genericHeaderEnd;
  }

  const headerPart1 = header;

  const headerPart2 =
    "20" +
    reversedFlagAssetId +
    "1b20766b6b6351b27500c8696c876700c8696c87916960b27521ac68201dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624105461704c6561662f656c656d656e747311546170547765616b2f656c656d656e747300c869557988cd5388d4" +
    compileData(WizData.fromNumber(2 * n + 6).hex) +
    "88d5" +
    compileData(WizData.fromNumber(2 * n + 8).hex) +
    "8853c9696b51c9696b52c9696b006b04ffffff7f6b";

  const finalHeader = headerPart1 + headerPart2;

  const footer =
    "6d6d756c756ce0" +
    compileData(WizData.fromNumber(bandwithArray[n]).hex) +
    "e0d769d58c767676cf69547a88d14f8800a888ce6953ce69888c76d1008814972ca4efa6bac21a771259e77dafabeeb0acbfe088ce6953ce69886c52cf69886c51cf69886c53cf698800ca6900d1698851ca6951d1698852ca6952d1698853ca6953d1698800c86900ce698851c86951ce698852c86952ce698853c86953ce6988040100000076767600cb8851cb8852cb8853cb88d2040200000088d3040000000087";

  return finalHeader + body + footer;
};

export const createCovenants = (leafCount: number, lookupLeafIndex: number, flagAssetId: string) => {
  const mainCovenantScript: string[] = [];

  for (let i = 0; i <= leafCount; i++) {
    mainCovenantScript.push(bodyCalculaterN(i, flagAssetId));
  }

  const scriptsWizData = mainCovenantScript.map((mcs) => WizData.fromHex(mcs));
  const controlBlock = taproot.controlBlockCalculation(scriptsWizData, "c4", "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624", lookupLeafIndex);

  return { mainCovenantScript, controlBlock };
};
