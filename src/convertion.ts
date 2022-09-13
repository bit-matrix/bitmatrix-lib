import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { lpFeeTiers } from "./pool";
import { div } from "./utils/helper";

export const convertForCtx2 = (
  value: number,
  slippage: number,
  pool: Pool,
  callMethod: CALL_METHOD
): { amount: number; amountWithSlipapge: number; minPair1Value: number; minPair2Value: number } => {
  const pair_1_coefficient = pool.pair1_coefficient.number;
  const pair_1_pool_supply = Number(pool.quote.value);

  const pair_2_pool_supply = Number(pool.token.value);

  let pair_2_coefficient;

  if (pair_2_pool_supply >= pair_1_pool_supply) {
    pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
  } else {
    pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
  }

  if (pair_2_coefficient < 1) {
    pair_2_coefficient = 1;
  }

  //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
  const pool_pair_1_liquidity_downgraded = Math.floor(pair_1_pool_supply / pair_1_coefficient);

  // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver
  const pool_pair_2_liquidity_downgraded = Math.floor(pair_2_pool_supply / pair_2_coefficient);

  // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
  const pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);

  const lpFeeTier = Object.values(lpFeeTiers)[pool.lpFeeTierIndex.number];

  const minPair1Value = Math.floor(9 * pair_2_coefficient);
  const minPair2Value = Math.floor(9 * pair_1_coefficient);

  if (callMethod === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
    const poolRateMulWithLbtcPoolRateMul = pair_2_pool_supply - value;

    // step 3
    const poolRateMulWithQuotePoolRate = div(poolRateMulWithLbtcPoolRateMul, pair_2_coefficient);

    // step 4
    const quotePoolTotalAmountWithRate = div(pool_constant, poolRateMulWithQuotePoolRate);

    // step 5
    const quotePoolTotalAmount = quotePoolTotalAmountWithRate * pair_1_coefficient;

    // step 6
    const quoteAmountSubFee = quotePoolTotalAmount - pair_1_pool_supply;

    const inp = div(lpFeeTier * quoteAmountSubFee, lpFeeTier - 1);

    const slippageAmount = div(value, slippage);

    const receivedAmount = value - slippageAmount;

    console.log(lpFeeTier * quoteAmountSubFee);

    if (inp < minPair1Value) {
      return { amount: 0, amountWithSlipapge: 0, minPair1Value, minPair2Value };
    }

    return { amount: inp, amountWithSlipapge: receivedAmount, minPair1Value, minPair2Value };
  } else if (callMethod === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
    const lbtcAmount = pair_1_pool_supply - value;

    const constantRate = div(lbtcAmount, pair_1_coefficient);

    const tokenLiquidtyRate = div(pool_constant, constantRate);

    const totalTokenLiquidity = tokenLiquidtyRate * pair_2_coefficient;

    const tokenAmountWithoutFee = totalTokenLiquidity - pair_2_pool_supply;

    const inp = div(lpFeeTier * tokenAmountWithoutFee, lpFeeTier - 1);

    const slippageAmount = div(value, slippage);

    const receivedAmount = value - slippageAmount;

    if (inp < minPair2Value) {
      console.log("1");
      return { amount: 0, amountWithSlipapge: 0, minPair1Value, minPair2Value };
    }

    return { amount: inp, amountWithSlipapge: receivedAmount, minPair1Value, minPair2Value };
  }

  return { amount: 0, amountWithSlipapge: 0, minPair1Value, minPair2Value };
};

export const calcAddLiquidityRecipientValue = (pool: Pool, quoteAmount: number, tokenAmount: number) => {
  const user_provided_remaining_lbtc_supply = quoteAmount;

  const user_provided_remaining_lbtc_supply_16 = Math.floor(user_provided_remaining_lbtc_supply / 16);

  const pool_lp_supply = Number(pool.lp.value);
  const pair_1_pool_supply = Number(pool.quote.value);
  const pair_2_pool_supply = Number(pool.token.value);

  const pool_lp_circulation = 2000000000 - pool_lp_supply;

  const mul_circ = user_provided_remaining_lbtc_supply_16 * pool_lp_circulation;
  const pool_lbtc_supply = Number(pool.quote.value);
  const pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / pool.pair1_coefficient.number);

  const user_lp_receiving_1 = Math.floor(mul_circ / pool_lbtc_supply_down);

  const user_provided_token_supply = tokenAmount;

  let pair_2_coefficient;

  if (pair_2_pool_supply >= pair_1_pool_supply) {
    pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pool.pair1_coefficient.number;
  } else {
    pair_2_coefficient = Math.floor(pool.pair1_coefficient.number / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
  }

  if (pair_2_coefficient < 1) {
    pair_2_coefficient = 1;
  }

  const user_provided_token_supply_down = Math.floor(user_provided_token_supply / pair_2_coefficient);
  const mul_circ2 = user_provided_token_supply_down * pool_lp_circulation;
  const pool_token_supply = Number(pool.token.value);
  const pool_token_supply_down = Math.floor(pool_token_supply / pair_2_coefficient);

  const user_lp_receiving_2 = Math.floor(mul_circ2 / pool_token_supply_down);

  const user_lp_received = Math.min(user_lp_receiving_1, user_lp_receiving_2);

  const poolRate = user_lp_received / (pool_lp_circulation + user_lp_received);

  return { lpReceived: user_lp_received, poolRate };
};

export const calcRemoveLiquidityRecipientValue = (pool: Pool, valLp: number) => {
  const user_lp_input = valLp;
  const pool_lbtc_supply = Number(pool.quote.value);
  const pool_token_supply = Number(pool.token.value);
  const pool_lp_supply = Number(pool.lp.value);

  const pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / pool.pair1_coefficient.number);
  const mul_1 = user_lp_input * pool_lbtc_supply_down;
  const lp_circ = 2000000000 - pool_lp_supply;
  const div_1 = Math.floor(mul_1 / lp_circ);

  const user_lbtc_received = div_1 * pool.pair1_coefficient.number;

  let pair_2_coefficient;

  if (pool_token_supply >= pool_lbtc_supply) {
    pair_2_coefficient = Math.floor(pool_token_supply / pool_lbtc_supply) * pool.pair1_coefficient.number;
  } else {
    pair_2_coefficient = Math.floor(pool.pair1_coefficient.number / Math.floor(pool_lbtc_supply / pool_token_supply));
  }

  if (pair_2_coefficient < 1) {
    pair_2_coefficient = 1;
  }

  const pool_token_supply_down = Math.floor(pool_token_supply / pair_2_coefficient);

  const mul_2 = user_lp_input * pool_token_supply_down;
  const div_2 = Math.floor(mul_2 / lp_circ);
  const user_token_received = div_2 * pair_2_coefficient;

  return {
    user_lbtc_received,
    user_token_received,
  };
};

export const convertForLiquidityCtx = (value: number, pool: Pool, isToken = false): number => {
  if (isToken) {
    const tokenInput = value;

    const quotePoolAmount = Number(pool.quote.value);
    const tokenPoolAmount = Number(pool.token.value);

    const quoteOutput = div(tokenInput * quotePoolAmount, tokenPoolAmount);

    return quoteOutput;
  } else {
    const quoteInput = value;
    const quotePoolAmount = Number(pool.quote.value);
    const tokenPoolAmount = Number(pool.token.value);
    const tokenOutput = div(quoteInput * tokenPoolAmount, quotePoolAmount);
    return tokenOutput;
  }
};
