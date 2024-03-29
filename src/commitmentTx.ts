import WizData, { hexLE } from "@script-wiz/wiz-data";
import { convertion, taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";
import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";

const calculateAmountTotal = (inputAmount: number, orderingFee: number, baseFee: number, serviceFee: number = 0) => {
  const totalAmount = inputAmount + orderingFee + baseFee + serviceFee;
  const totalAmount64 = convertion.numToLE64(WizData.fromNumber(totalAmount)).hex;
  const totalAmount64BE = hexLE(totalAmount64);
  return totalAmount64BE;
};

export const quoteToTokenCreateCommitmentTx = (
  inputAmount: number,
  txId: string,
  publicKey: string,
  calculatedAmountWithSlippage: number,
  config: BmConfig,
  pool: Pool
): string => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  const quoteAssetIdLE = hexLE(pool.quote.assetHash);
  const poolIdLE = hexLE(pool.id);

  const receivedAmount = convertion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";

  const constLength4 = "01" + quoteAssetIdLE + "01";

  const inputMod2 = inputAmount % 2;

  const ctxOutput1 = calculateAmountTotal(inputAmount / 2 + inputMod2, config.defaultOrderingFee.number, config.baseFee.number + config.serviceFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(config.innerPublicKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubkey.hex;

  const ctxOutput2 = "01" + quoteAssetIdLE + "01" + hexLE(convertion.numToLE64(WizData.fromNumber(inputAmount / 2)).hex) + "0022";

  const constLength7 = "01" + quoteAssetIdLE + "01";

  const commitmentTxFee64LE = convertion.numToLE64(WizData.fromNumber(config.commitmentTxFee.number)).hex;

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
    ctxOutput1 +
    constLength5 +
    scriptPubKey +
    ctxOutput2 +
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
  calculatedAmountWithSlippage: number,
  config: BmConfig,
  pool: Pool
): string => {
  const methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  const quoteAssetIdLE = hexLE(pool.quote.assetHash);
  const poolIdLE = hexLE(pool.id);

  const receivedAmount = convertion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";

  const constLength4 = "01" + quoteAssetIdLE + "01";

  const feeAmountsTotal = calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(config.innerPublicKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubkey.hex;

  const tokenAssetIdLE = hexLE(pool.token.assetHash);

  const constLength6 = "01" + tokenAssetIdLE + "01";

  const inputAmount64LE = convertion.numToLE64(WizData.fromNumber(inputAmount)).hex;

  const inputAmount64BE = hexLE(inputAmount64LE);

  const constLength7 = "0022";

  const constLength8 = "01" + quoteAssetIdLE + "01";

  const commitmentTxFee64LE = convertion.numToLE64(WizData.fromNumber(config.commitmentTxFee.number)).hex;

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

export const liquidityAddCreateCommitmentTx = (quoteAmount: number, tokenAmount: number, txId: string, publicKey: string, config: BmConfig, pool: Pool): string => {
  const methodCall = CALL_METHOD.ADD_LIQUIDITY;
  const quoteAssetIdLE = hexLE(pool.quote.assetHash);
  const tokenAssetIdLE = hexLE(pool.token.assetHash);
  const poolIdLE = hexLE(pool.id);

  const receivedAmount = hexLE(calculateAmountTotal(quoteAmount, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));

  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";

  const constLength4 = "01" + quoteAssetIdLE + "01";

  const inputAmountTotal = calculateAmountTotal(quoteAmount, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(config.innerPublicKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubkey.hex;

  const constLength6 = "01" + tokenAssetIdLE + "01" + hexLE(convertion.numToLE64(WizData.fromNumber(tokenAmount)).hex) + "0022";

  const constLength7 = "01" + quoteAssetIdLE + "01";

  const commitmentTxFee64LE = convertion.numToLE64(WizData.fromNumber(config.commitmentTxFee.number)).hex;

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

export const liquidityRemoveCreateCommitmentTx = (lpAmount: number, txId: string, publicKey: string, config: BmConfig, pool: Pool): string => {
  const methodCall = CALL_METHOD.REMOVE_LIQUIDITY;
  const quoteAssetIdLE = hexLE(pool.quote.assetHash);
  const lpAssetIdLE = hexLE(pool.lp.assetHash);
  const poolIdLE = hexLE(pool.id);

  const receivedAmount = hexLE(calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));

  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const commitmentOutputTapscriptTemplate = "20" + poolIdLE + "766b6b6351b27500c8696c876700c8696c87916960b27521" + publicKey + "ac68";

  const constLength = "020000000102";

  const rpcTxId = hexLE(txId);

  const constLength2 = "0000000000ffffffff";

  const constLength3 = "0100000000ffffffff0401" + quoteAssetIdLE + "01000000000000000000516a4c4e";

  const constLength4 = "01" + quoteAssetIdLE + "01";

  const inputAmountTotal = calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number);

  const constLength5 = "0022";

  const scriptPubKey = taproot.tapRoot(WizData.fromHex(config.innerPublicKey), [WizData.fromHex(commitmentOutputTapscriptTemplate)], TAPROOT_VERSION.LIQUID).scriptPubkey.hex;

  const constLength6 = "01" + lpAssetIdLE + "01" + hexLE(convertion.numToLE64(WizData.fromNumber(lpAmount)).hex) + "0022";

  const constLength7 = "01" + quoteAssetIdLE + "01";

  const commitmentTxFee64LE = convertion.numToLE64(WizData.fromNumber(config.commitmentTxFee.number)).hex;

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
