import { lpFeeRate, poolLbtcLiquidity, poolTokenLiquidity, quotePrecisionCoefficient, tokenPrecisionCoefficient } from "./env";
import { FundingOutput } from "./model/FundingOutput";
import { div } from "./utils/helper";

export const lbtcToToken = (
  lbtcAmount: number,
  fundingOutputAdress: string,
  quoteAssetId: string,
  baseFee: number,
  serviceFee: number,
  commitmentTxFee: number,
  orderingFee: number
): FundingOutput => {
  // lbtc satoshi amount with slippage
  const fundingOutput1Value = lbtcAmount;
  const fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;

  const fundingOutput1Address = fundingOutputAdress;
  const fundingOutput2Address = fundingOutputAdress;

  const fundingOutput1AssetId = quoteAssetId;
  const fundingOutput2AssetId = quoteAssetId;

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
export const lbtcToTokenAmount = (lbtcAmount: number, slippage: number, minRemainingSupply: string): number => {
  // validation
  if (lbtcAmount < Number(minRemainingSupply)) {
    console.log(`Lbtc amount must greater or at least minimum equal ${minRemainingSupply}`);
    return 0;
  }

  // step1   (lp fee calculate)
  const lpFee = div(lbtcAmount, lpFeeRate);

  // step 2 (sub fee amount)
  const lbtcAmountSubFee = lbtcAmount - lpFee;

  // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
  const lbtcPoolTotalAmount = poolLbtcLiquidity + lbtcAmountSubFee;

  // step 4 (lbtPoolTotalAmount with rate 16)
  const lbtcPoolTotalAmountWithRate = div(lbtcPoolTotalAmount, quotePrecisionCoefficient);

  // step 5 (lbtPoolAmount  with rate 16)
  const lbtcPoolAmountWithRate = div(poolLbtcLiquidity, quotePrecisionCoefficient);

  // step 6 (usdtPoolAmount  with rate 2 million)
  const usdtPoolAmountWithRate = div(poolTokenLiquidity, tokenPrecisionCoefficient);

  // step 7 (mul step 5 , step6)
  const poolRateMul = lbtcPoolAmountWithRate * usdtPoolAmountWithRate;

  // step 8 (div step7  step4)
  const poolRateMulWithLbtcPoolRate = div(poolRateMul, lbtcPoolTotalAmountWithRate);

  // step 9  (step8 * 2 million)
  const poolRateMulWithLbtcPoolRateMul = poolRateMulWithLbtcPoolRate * tokenPrecisionCoefficient;

  // step 10  (Pool Token liquidity - 9.step)
  const finalTokenPoolLiquidity = poolTokenLiquidity - poolRateMulWithLbtcPoolRateMul;

  //step11 ( step 10 - 1milion)
  const tokenAmount = finalTokenPoolLiquidity - 1000000;

  // step 12 slippage amount calculation with slippage
  const slippageAmount = div(tokenAmount, slippage);

  const finalAmount = tokenAmount - slippageAmount;

  return finalAmount;
};

export const tokenToLBtc = (
  tokenAmount: number,
  fundingOutputAdress: string,
  quoteAssetId: string,
  tokenAssetId: string,
  baseFee: number,
  serviceFee: number,
  commitmentTxFee: number,
  orderingFee: number
): FundingOutput => {
  const fundingOutput1Value = tokenAmount;

  const fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;

  const fundingOutput1Address = fundingOutputAdress;
  const fundingOutput2Address = fundingOutputAdress;

  // token asset id
  const fundingOutput1AssetId = tokenAssetId;

  // lbtc asset id
  const fundingOutput2AssetId = quoteAssetId;

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

export const tokenToLbtcAmount = (usdtAmount: number, slippage: number, minTokenValue: string): number => {
  // validation
  if (usdtAmount < Number(minTokenValue)) {
    console.log(`Usdt amount must greater or at least minimum equal ${minTokenValue}`);
    return 0;
  }

  // step1 (fee calculation)
  const lpFee = div(usdtAmount, lpFeeRate);

  // step2 (input new value without fee  input - step1)
  const usdtAmountWithoutFee = usdtAmount - lpFee;

  // step3 (total usd pool amount poolUsdtLiquidity + step2)
  const totalUsdtLiquidity = poolTokenLiquidity + usdtAmountWithoutFee;

  // step4  (usdt Liquidty rate calculation step3 % 2mn)
  const usdtLiquidtyRate = div(totalUsdtLiquidity, tokenPrecisionCoefficient);

  // step5 (Pool L-BTC liquidity % 16)
  const x = div(poolLbtcLiquidity, quotePrecisionCoefficient);

  // step6 (Pool Token liquidity % 2MN)
  const y = div(poolTokenLiquidity, tokenPrecisionCoefficient);

  // step 7 (constant x*y = k step5*step6)
  const constant = x * y;

  // step 8 (constant * usdtLiquidtyRate  step7*step4
  const constantRate = div(constant, usdtLiquidtyRate);

  //step 9 (step 8 * 16)
  const lbtcAmount = constantRate * quotePrecisionCoefficient;

  //step 10 (poolLbtcLiquidity - step9)
  const remainingLbtcAmount = poolLbtcLiquidity - lbtcAmount;

  const slippageAmount = div(remainingLbtcAmount, slippage);

  const finalAmount = remainingLbtcAmount - slippageAmount;

  return finalAmount;
};
