import { lpFeeRate, poolLbtcLiquidity, poolTokenLiquidity } from "./env";
import { FundingOutput } from "./model/FundingOutput";
import { div } from "./utils/helper";

export const lbtcToTokenSwap = (lbtcAmount: number, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number): FundingOutput => {
  // lbtc satoshi amount with slippage
  const fundingOutput1Value = lbtcAmount;

  const fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;

  const fundingOutput1Address = "tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg";
  const fundingOutput2Address = "tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg";

  const fundingOutput1AssetId = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

  const fundingOutput2AssetId = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

// all amounts satoshi
export const lbtcToTokenSwapAmountCalculate = (lbtcAmount: number, slippage: number): number => {
  // validation
  if (lbtcAmount < 1000) {
    console.log("Lbtc amount must greater or at least minimum equal 1000");
    return 0;
  }

  // step1   (lp fee calculate)
  const lpFee = div(lbtcAmount, lpFeeRate);

  // step 2 (sub fee amount)
  const lbtcAmountSubFee = lbtcAmount - lpFee;

  // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
  const lbtcPoolTotalAmount = poolLbtcLiquidity + lbtcAmountSubFee;

  // step 4 (lbtPoolTotalAmount with rate 16)
  const lbtcPoolTotalAmountWithRate = div(lbtcPoolTotalAmount, 16);

  // step 5 (lbtPoolAmount  with rate 16)
  const lbtcPoolAmountWithRate = div(poolLbtcLiquidity, 16);

  // step 6 (usdtPoolAmount  with rate 2 million)
  const usdtPoolAmountWithRate = div(poolTokenLiquidity, 2000000);

  // step 7 (mul step 5 , step6)
  const poolRateMul = lbtcPoolAmountWithRate * usdtPoolAmountWithRate;

  // step 8 (div step7  step4)
  const poolRateMulWithLbtcPoolRate = div(poolRateMul, lbtcPoolTotalAmountWithRate);

  // step 9  (step8 * 2 million)
  const poolRateMulWithLbtcPoolRateMul = poolRateMulWithLbtcPoolRate * 2000000;

  // step 10  (Pool Token liquidity - 9.step)
  const finalTokenPoolLiquidity = poolTokenLiquidity - poolRateMulWithLbtcPoolRateMul;

  //step11 ( step 10 - 1milion)
  const tokenAmount = finalTokenPoolLiquidity - 1000000;

  // step 12 slippage amount calculation with slippage
  const slippageAmount = div(tokenAmount, slippage);

  const finalAmount = tokenAmount - slippageAmount;

  return finalAmount;
};

export const tokenToLbtcSwapAmountCalculate = (usdtAmount: number, slippage: number): number => {
  // validation
  if (usdtAmount < 50000000) {
    console.log("Usdt amount must greater or at least minimum equal 50000000");
    return 0;
  }

  // step1 (fee calculation)
  const lpFee = div(usdtAmount, lpFeeRate);

  // step2 (input new value without fee  input - step1)
  const usdtAmountWithoutFee = usdtAmount - lpFee;

  // step3 (total usd pool amount poolUsdtLiquidity + step2)
  const totalUsdtLiquidity = poolTokenLiquidity + usdtAmountWithoutFee;

  // step4  (usdt Liquidty rate calculation step3 % 2mn)
  const usdtLiquidtyRate = div(totalUsdtLiquidity, 2000000);

  // step5 (Pool L-BTC liquidity % 16)
  const x = div(poolLbtcLiquidity, 16);

  // step6 (Pool Token liquidity % 2MN)
  const y = div(poolTokenLiquidity, 2000000);

  // step 7 (constant x*y = k step5*step6)
  const constant = x * y;

  // step 8 (constant * usdtLiquidtyRate  step7*step4
  const constantRate = div(constant, usdtLiquidtyRate);

  //step 9 (step 8 * 16)
  const lbtcAmount = constantRate * 16;

  //step 10 (poolLbtcLiquidity - step9)
  const remainingLbtcAmount = poolLbtcLiquidity - lbtcAmount;

  const slippageAmount = div(remainingLbtcAmount, slippage);

  const finalAmount = remainingLbtcAmount - slippageAmount;

  return finalAmount;
};

export const tokenToLBtcSwap = (usdtAmount: number, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number): FundingOutput => {
  const fundingOutput1Value = usdtAmount;

  const fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;

  const fundingOutput1Address = "tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg";
  const fundingOutput2Address = "tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg";

  // token asset id
  const fundingOutput1AssetId = "213cbc4df83abc230852526b1156877f60324da869f0affaee73b6a6a32ad025";

  // lbtc asset id
  const fundingOutput2AssetId = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};
