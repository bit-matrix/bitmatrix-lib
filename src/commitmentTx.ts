import WizData, { hexLE } from "@script-wiz/wiz-data";
import { conversion, taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";
import { CALL_METHOD } from "@bitmatrix/models";
import { targetAssetId } from "./env";

const calculateAmountTotal = (inputAmount: number, orderingFee: number, baseFee: number) => {
  const totalAmount = inputAmount + orderingFee + baseFee;
  const totalAmount64 = conversion.numToLE64(WizData.fromNumber(totalAmount)).hex;
  const totalAmount64BE = hexLE(totalAmount64);
  return totalAmount64BE;
};

export const lbtcToTokenCreateCommitmentTx = (
  inputAmount: number,
  txId: string,
  publicKey: string,
  calculatedAmountWithSlippage: number,
  orderingFee: { number: number; hex: string },
  baseFee: { number: number; hex: string },
  commitmentTxFee: { number: number; hex: string },
  internalKey: string
): string => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;

  const receivedAmount = conversion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = hexLE(targetAssetId) + methodCall + publicKey + receivedAmount + orderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + hexLE(targetAssetId) + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000000000516a4c4e";

  const constLength4 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401";

  const inputAmountTotal = calculateAmountTotal(inputAmount, orderingFee.number, baseFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(internalKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubKey.hex;

  const constLength6 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000028a0022";

  const constLength7 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401";

  const commitmentTxFee64LE = conversion.numToLE64(WizData.fromNumber(commitmentTxFee.number)).hex;

  const commitmentTxFee64BE = hexLE(commitmentTxFee64LE);

  const constLength8 = "00007ba513000000010151000000010151000000000000000000";

  const commitmentTransactionRaw =
    constLength +
    rpcTxId +
    constLength2 +
    rpcTxId +
    constLength3 +
    callData +
    constLength4 +
    inputAmountTotal +
    constLength5 +
    scriptPubKey +
    constLength6 +
    scriptPubKey +
    constLength7 +
    commitmentTxFee64BE +
    constLength8;

  // send raw transaction
  console.log(commitmentTransactionRaw);

  return commitmentTransactionRaw;
};

export const tokenToLbtcCreateCommitmentTx = (
  inputAmount: number,
  txId: string,
  publicKey: string,
  calculatedAmountWithSlippage: number,
  orderingFee: { number: number; hex: string },
  baseFee: { number: number; hex: string },
  serviceFee: { number: number; hex: string },
  commitmentTxFee: { number: number; hex: string },
  internalKey: string
): string => {
  // case1
  const methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;

  const receivedAmount = conversion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = hexLE(targetAssetId) + methodCall + publicKey + receivedAmount + orderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + hexLE(targetAssetId) + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000000000516a4c4e";

  const constLength4 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401";

  const feeAmountsTotal = calculateAmountTotal(serviceFee.number, orderingFee.number, baseFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(internalKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubKey.hex;

  const constLength6 = "0125d02aa3a6b673eefaaff069a84d32607f8756116b52520823bc3af84dbc3c2101";

  const inputAmount64LE = conversion.numToLE64(WizData.fromNumber(inputAmount)).hex;

  const inputAmount64BE = hexLE(inputAmount64LE);

  const constLength7 = "0022";

  const constLength8 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401";

  const commitmentTxFee64LE = conversion.numToLE64(WizData.fromNumber(commitmentTxFee.number)).hex;

  const commitmentTxFee64BE = hexLE(commitmentTxFee64LE);

  const constLength9 = "00007ba513000000010151000000010151000000000000000000";

  const commitmentTransactionRaw =
    constLength +
    rpcTxId +
    constLength2 +
    rpcTxId +
    constLength3 +
    callData +
    constLength4 +
    feeAmountsTotal +
    constLength5 +
    scriptPubKey +
    constLength6 +
    inputAmount64BE +
    constLength7 +
    scriptPubKey +
    constLength8 +
    commitmentTxFee64BE +
    constLength9;

  return commitmentTransactionRaw;
};
