import WizData, { hexLE } from "@script-wiz/wiz-data";
import { conversion, taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";
import { BmConfig, CALL_METHOD } from "@bitmatrix/models";

const calculateAmountTotal = (inputAmount: number, orderingFee: number, baseFee: number) => {
  const totalAmount = inputAmount + orderingFee + baseFee;
  const totalAmount64 = conversion.numToLE64(WizData.fromNumber(totalAmount)).hex;
  const totalAmount64BE = hexLE(totalAmount64);
  return totalAmount64BE;
};

export const quoteToTokenCreateCommitmentTx = (
  inputAmount: number,
  txId: string,
  publicKey: string,
  calculatedAmountWithSlippage: number,
  config: BmConfig,
  quoteAssetId: string,
  poolId: string
): string => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  const quoteAssetIdLE = hexLE(quoteAssetId);

  const receivedAmount = conversion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = hexLE(poolId) + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + hexLE(poolId) + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";

  const constLength4 = "01" + quoteAssetIdLE + "01";

  const inputAmountTotal = calculateAmountTotal(inputAmount, config.defaultOrderingFee.number, config.baseFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(config.innerPublicKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubKey.hex;

  const constLength6 = "01" + quoteAssetIdLE + "01000000000000028a0022";

  const constLength7 = "01" + quoteAssetIdLE + "01";

  const commitmentTxFee64LE = conversion.numToLE64(WizData.fromNumber(config.commitmentTxFee.number)).hex;

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

  return commitmentTransactionRaw;
};

export const tokenToQuoteCreateCommitmentTx = (
  inputAmount: number,
  txId: string,
  publicKey: string,
  tokenAssetId: string,
  quoteAssetId: string,
  calculatedAmountWithSlippage: number,
  config: BmConfig,
  poolId: string
): string => {
  const methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  const quoteAssetIdLE = hexLE(quoteAssetId);

  const receivedAmount = conversion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = hexLE(poolId) + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + hexLE(poolId) + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";

  const constLength4 = "01" + quoteAssetIdLE + "01";

  const feeAmountsTotal = calculateAmountTotal(config.serviceFee.number, config.defaultOrderingFee.number, config.baseFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(config.innerPublicKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubKey.hex;

  const tokenAssetIdLE = hexLE(tokenAssetId);

  const constLength6 = "01" + tokenAssetIdLE + "01";

  const inputAmount64LE = conversion.numToLE64(WizData.fromNumber(inputAmount)).hex;

  const inputAmount64BE = hexLE(inputAmount64LE);

  const constLength7 = "0022";

  const constLength8 = "01" + quoteAssetIdLE + "01";

  const commitmentTxFee64LE = conversion.numToLE64(WizData.fromNumber(config.commitmentTxFee.number)).hex;

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
