import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { Wallet } from "./wallet";
import WizData, { hexLE } from "@script-wiz/wiz-data";

import { convertion } from "@script-wiz/lib-core";
import { commitmentOutputTapscript } from "./commitmentOutput";
import { signTx } from "./signer";
import { calculateAmountTotal } from "./utils/helper";
import { AddressRecipient } from "marina-provider";

export const case1 = (
  wallet: Wallet,
  inputAmount: number,
  calculatedAmountWithSlippage: number,
  pool: Pool,
  config: BmConfig,
  publicKey: string,
  feeAssetHash: string,
  isTestnet = false
): Promise<string> => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  const poolIdLE = hexLE(pool.id);
  const receivedAmount = convertion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  // Call data OP_RETURN
  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const address = isTestnet
    ? commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.testnet
    : commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.mainnet;

  const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;

  const recipients: AddressRecipient[] = [
    {
      value: totalFee,
      address,
      asset: feeAssetHash,
    },
    {
      value: inputAmount,
      address,
      asset: pool.quote.assetHash,
    },
  ];

  return signTx(wallet, callData, recipients, isTestnet);
};

export const case2 = (
  wallet: Wallet,
  inputAmount: number,
  calculatedAmountWithSlippage: number,
  pool: Pool,
  config: BmConfig,
  publicKey: string,
  feeAssetHash: string,
  isTestnet = false
): Promise<string> => {
  const methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  const poolIdLE = hexLE(pool.id);
  const receivedAmount = convertion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;

  // Call data OP_RETURN
  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const address = isTestnet
    ? commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.testnet
    : commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.mainnet;

  const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;

  const recipients: AddressRecipient[] = [
    {
      value: totalFee,
      address,
      asset: feeAssetHash,
    },
    {
      value: inputAmount,
      address,
      asset: pool.token.assetHash,
    },
  ];

  return signTx(wallet, callData, recipients, isTestnet);
};

export const case3 = (
  wallet: Wallet,
  inputAmountPair1: number,
  inputAmountPair2: number,
  pool: Pool,
  config: BmConfig,
  publicKey: string,
  feeAssetHash: string,
  isTestnet = false
): Promise<string> => {
  const methodCall = CALL_METHOD.ADD_LIQUIDITY;
  const poolIdLE = hexLE(pool.id);

  // const receivedAmount = hexLE(calculateAmountTotal(inputAmountPair1, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));
  // const receivedAmountNumber = inputAmountPair1 + config.defaultOrderingFee.number + config.baseFee.number + config.serviceFee.number;

  const receivedAmount = "0000000000000000";

  // Call data OP_RETURN
  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const address = isTestnet
    ? commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.testnet
    : commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.mainnet;

  const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;

  const recipients: AddressRecipient[] = [
    {
      value: totalFee,
      address,
      asset: feeAssetHash,
    },
    {
      value: inputAmountPair1,
      address,
      asset: pool.quote.assetHash,
    },
    {
      value: inputAmountPair2,
      address,
      asset: pool.token.assetHash,
    },
  ];

  return signTx(wallet, callData, recipients, isTestnet);
};

export const case4 = (wallet: Wallet, lpAmount: number, pool: Pool, config: BmConfig, publicKey: string, feeAssetHash: string, isTestnet = false): Promise<string> => {
  const methodCall = CALL_METHOD.REMOVE_LIQUIDITY;
  const poolIdLE = hexLE(pool.id);

  const receivedAmount = hexLE(calculateAmountTotal(0, config.defaultOrderingFee.number, config.baseFee.number, config.serviceFee.number));

  // Call data OP_RETURN
  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const address = isTestnet
    ? commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.testnet
    : commitmentOutputTapscript(pool.id, publicKey).taprootResult.address.mainnet;

  const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;

  const recipients: AddressRecipient[] = [
    {
      value: totalFee,
      address,
      asset: feeAssetHash,
    },
    {
      value: lpAmount,
      address,
      asset: pool.lp.assetHash,
    },
  ];

  return signTx(wallet, callData, recipients, isTestnet);
};
