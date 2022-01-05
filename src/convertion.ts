import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { lpFeeRate, quotePrecisionCoefficient, tokenPrecisionCoefficient } from "./env";
import { div } from "./utils/helper";

export const convertForCtx = (
  value: number,
  slippage: number,
  pool: Pool,
  config: BmConfig,
  callMethod: CALL_METHOD,
  constant: number
): { amount: number; amountWithSlipapge: number } => {
  if (callMethod === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
    if (value < Number(config.minRemainingSupply)) {
      console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
      return { amount: 0, amountWithSlipapge: 0 };
    }

    // step1  (lp fee calculate)
    const lpFee = div(value, lpFeeRate);

    // step 2 (sub fee amount)
    const quoteAmountSubFee = value - lpFee;

    // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
    const quotePoolTotalAmount = Number(pool.quote.value) + quoteAmountSubFee;

    // step 4 (lbtPoolTotalAmount with rate 16)
    const quotePoolTotalAmountWithRate = div(quotePoolTotalAmount, quotePrecisionCoefficient);

    // step 5 (lbtPoolAmount  with rate 16)
    const quotePoolAmountWithRate = div(Number(pool.quote.value), quotePrecisionCoefficient);

    // step 6 (usdtPoolAmount  with rate 2 million)
    const usdtPoolAmountWithRate = div(Number(pool.token.value), tokenPrecisionCoefficient);

    // step 7 (mul step 5 , step6)
    const poolRateMul = quotePoolAmountWithRate * usdtPoolAmountWithRate;

    // step 8 (div step7  step4)
    const poolRateMulWithQuotePoolRate = div(poolRateMul, quotePoolTotalAmountWithRate);

    // step 9  (step8 * 2 million)
    const poolRateMulWithLbtcPoolRateMul = poolRateMulWithQuotePoolRate * tokenPrecisionCoefficient;

    // step 10  (Pool Token liquidity - 9.step)
    const finalTokenPoolLiquidity = Number(pool.token.value) - poolRateMulWithLbtcPoolRateMul;

    //step11 ( step 10 - 1milion)
    const tokenAmount = finalTokenPoolLiquidity - constant;

    const slippageAmount = div(tokenAmount, slippage);

    const receivedAmount = tokenAmount - slippageAmount;

    return { amount: tokenAmount, amountWithSlipapge: receivedAmount };
  } else if (callMethod === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
    // validation
    if (value < Number(config.minTokenValue)) {
      console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
      return { amount: 0, amountWithSlipapge: 0 };
    }

    // step1 (fee calculation)
    const lpFee = div(value, lpFeeRate);

    // step2 (input new value without fee  input - step1)
    const usdtAmountWithoutFee = value - lpFee;

    // step3 (total token pool amount poolUsdtLiquidity + step2)
    const totalUsdtLiquidity = Number(pool.token.value) + usdtAmountWithoutFee;

    // step4  (usdt Liquidty rate calculation step3 % 2mn)
    const usdtLiquidtyRate = div(totalUsdtLiquidity, tokenPrecisionCoefficient);

    // step5 (Pool L-BTC liquidity % 16)
    const x = div(Number(pool.quote.value), quotePrecisionCoefficient);

    // step6 (Pool Token liquidity % 2MN)
    const y = div(Number(pool.token.value), tokenPrecisionCoefficient);

    // step 7 (constant x*y = k step5*step6)
    const constant = x * y;

    // step 8 (constant * usdtLiquidtyRate  step7*step4
    const constantRate = div(constant, usdtLiquidtyRate);

    //step 9 (step 8 * 16)
    const lbtcAmount = constantRate * quotePrecisionCoefficient;

    //step 10 (poolLbtcLiquidity - step9)
    const tokenValue = Number(pool.quote.value) - lbtcAmount;

    const slippageAmount = div(tokenValue, slippage);

    const receivedAmount = tokenValue - slippageAmount;

    return { amount: tokenValue, amountWithSlipapge: receivedAmount };
  }

  return { amount: 0, amountWithSlipapge: 0 };
};
