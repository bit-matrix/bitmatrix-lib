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
  internalKey: string
): string => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;

  const calculatedAmountWithSlippage64 = conversion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = targetAssetId + methodCall + publicKey + calculatedAmountWithSlippage64 + orderingFee.hex;

  const commitmentOutputTapscriptTemplate = "630401000000b200c86920" + targetAssetId + "876700c86920" + targetAssetId + "879169043c000000b221" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000000000516a4c4e";

  const constLength4 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401";

  const inputAmountTotal = calculateAmountTotal(inputAmount, orderingFee.number, baseFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(internalKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubKey.hex;

  const constLength6 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000028a0022";

  const constLength7 = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14010000000000000064";

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
    constLength8;

  // send raw transaction
  console.log(commitmentTransactionRaw);

  return commitmentTransactionRaw;
};