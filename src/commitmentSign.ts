import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { Wallet } from "./wallet";
import WizData, { hexLE } from "@script-wiz/wiz-data";

import { convertion } from "@script-wiz/lib-core";
import { RecipientInterface } from "ldk";
import { commitmentOutputTapscript } from "./commitmentOutput";
import { signTx } from "./ldk";

export const case1 = (wallet: Wallet, inputAmount: number, calculatedAmountWithSlippage: number, pool: Pool, config: BmConfig, publicKey: string): Promise<string> => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  const poolIdLE = hexLE(pool.id);
  const receivedAmount = convertion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;
  console.log("receivedAmount", receivedAmount);

  // Call data OP_RETURN
  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const address = commitmentOutputTapscript(pool.quote.asset, config.innerPublicKey).taprootResult.address.testnet;

  const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;

  const receipents: RecipientInterface[] = [
    {
      value: totalFee,
      address,
      asset: pool.quote.asset,
    },
    {
      value: inputAmount,
      address,
      asset: pool.quote.asset,
    },
  ];

  return signTx(wallet, callData, receipents);
};

export const case2 = (wallet: Wallet, inputAmount: number, calculatedAmountWithSlippage: number, pool: Pool, config: BmConfig, publicKey: string): Promise<string> => {
  const methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  const poolIdLE = hexLE(pool.id);
  const receivedAmount = convertion.numToLE64(WizData.fromNumber(calculatedAmountWithSlippage)).hex;
  console.log("receivedAmount", receivedAmount);

  // Call data OP_RETURN
  const callData = poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;
  const address = commitmentOutputTapscript(pool.token.asset, config.innerPublicKey).taprootResult.address.testnet;

  const totalFee = config.baseFee.number + config.commitmentTxFee.number + config.serviceFee.number + config.defaultOrderingFee.number;

  const receipents: RecipientInterface[] = [
    {
      value: totalFee,
      address,
      asset: pool.quote.asset,
    },
    {
      value: inputAmount,
      address,
      asset: pool.token.asset,
    },
  ];

  return signTx(wallet, callData, receipents);
};
