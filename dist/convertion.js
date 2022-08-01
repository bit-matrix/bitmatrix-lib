"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForLiquidityCtx = exports.calcRemoveLiquidityRecipientValue = exports.calcAddLiquidityRecipientValue = exports.convertForCtx2 = exports.convertForCtx = void 0;
const models_1 = require("@bitmatrix/models");
const env_1 = require("./env");
const helper_1 = require("./utils/helper");
const convertForCtx = (value, slippage, pool, config, callMethod) => {
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        if (value < Number(config.minRemainingSupply)) {
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // step1  (lp fee calculate)
        const lpFee = (0, helper_1.div)(value, env_1.lpFeeRate);
        // step 2 (sub fee amount)
        const quoteAmountSubFee = value - lpFee;
        // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
        const quotePoolTotalAmount = Number(pool.quote.value) + quoteAmountSubFee;
        // step 4 (lbtPoolTotalAmount with rate 16)
        const quotePoolTotalAmountWithRate = (0, helper_1.div)(quotePoolTotalAmount, env_1.quotePrecisionCoefficient);
        // step 5 (lbtPoolAmount  with rate 16)
        const quotePoolAmountWithRate = (0, helper_1.div)(Number(pool.quote.value), env_1.quotePrecisionCoefficient);
        // step 6 (usdtPoolAmount  with rate 2 million)
        const usdtPoolAmountWithRate = (0, helper_1.div)(Number(pool.token.value), env_1.tokenPrecisionCoefficient);
        // step 7 (mul step 5 , step6)
        const poolRateMul = quotePoolAmountWithRate * usdtPoolAmountWithRate;
        // step 8 (div step7  step4)
        const poolRateMulWithQuotePoolRate = (0, helper_1.div)(poolRateMul, quotePoolTotalAmountWithRate);
        // step 9  (step8 * 2 million)
        const poolRateMulWithLbtcPoolRateMul = poolRateMulWithQuotePoolRate * env_1.tokenPrecisionCoefficient;
        // step 10  (Pool Token liquidity - 9.step)
        const finalTokenPoolLiquidity = Number(pool.token.value) - poolRateMulWithLbtcPoolRateMul;
        //step11 ( step 10 - 1milion)
        const tokenAmount = finalTokenPoolLiquidity - config.recipientValueMinus;
        const slippageAmount = (0, helper_1.div)(tokenAmount, slippage);
        const receivedAmount = tokenAmount - slippageAmount;
        return { amount: tokenAmount, amountWithSlipapge: receivedAmount };
    }
    else if (callMethod === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        // validation
        if (value < Number(config.minTokenValue)) {
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // step1 (fee calculation)
        const lpFee = (0, helper_1.div)(value, env_1.lpFeeRate);
        // step2 (input new value without fee  input - step1)
        const usdtAmountWithoutFee = value - lpFee;
        // step3 (total token pool amount poolUsdtLiquidity + step2)
        const totalUsdtLiquidity = Number(pool.token.value) + usdtAmountWithoutFee;
        // step4  (usdt Liquidty rate calculation step3 % 2mn)
        const usdtLiquidtyRate = (0, helper_1.div)(totalUsdtLiquidity, env_1.tokenPrecisionCoefficient);
        // step5 (Pool L-BTC liquidity % 16)
        const x = (0, helper_1.div)(Number(pool.quote.value), env_1.quotePrecisionCoefficient);
        // step6 (Pool Token liquidity % 2MN)
        const y = (0, helper_1.div)(Number(pool.token.value), env_1.tokenPrecisionCoefficient);
        // step 7 (constant x*y = k step5*step6)
        const constant = x * y;
        // step 8 (constant * usdtLiquidtyRate  step7*step4
        const constantRate = (0, helper_1.div)(constant, usdtLiquidtyRate);
        //step 9 (step 8 * 16)
        const lbtcAmount = constantRate * env_1.quotePrecisionCoefficient;
        //step 10 (poolLbtcLiquidity - step9)
        const tokenValue = Number(pool.quote.value) - lbtcAmount;
        const slippageAmount = (0, helper_1.div)(tokenValue, slippage);
        const receivedAmount = tokenValue - slippageAmount;
        return { amount: tokenValue, amountWithSlipapge: receivedAmount };
    }
    return { amount: 0, amountWithSlipapge: 0 };
};
exports.convertForCtx = convertForCtx;
const convertForCtx2 = (value, slippage, pool, config, callMethod) => {
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        if (value < Number(config.minTokenValue)) {
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // extra
        const quotePoolAmountWithRate = (0, helper_1.div)(Number(pool.quote.value), env_1.quotePrecisionCoefficient);
        const usdtPoolAmountWithRate = (0, helper_1.div)(Number(pool.token.value), env_1.tokenPrecisionCoefficient);
        const poolRateMul = quotePoolAmountWithRate * usdtPoolAmountWithRate;
        // step 1
        const finalTokenPoolLiquidity = value + config.recipientValueMinus;
        // step 2
        const poolRateMulWithLbtcPoolRateMul = Number(pool.token.value) - finalTokenPoolLiquidity;
        // step 3
        const poolRateMulWithQuotePoolRate = (0, helper_1.div)(poolRateMulWithLbtcPoolRateMul, env_1.tokenPrecisionCoefficient);
        // step 4
        const quotePoolTotalAmountWithRate = (0, helper_1.div)(poolRateMul, poolRateMulWithQuotePoolRate);
        // step 5
        const quotePoolTotalAmount = quotePoolTotalAmountWithRate * env_1.quotePrecisionCoefficient;
        // step 6
        const quoteAmountSubFee = quotePoolTotalAmount - Number(pool.quote.value);
        const inp = (0, helper_1.div)(env_1.lpFeeRate * quoteAmountSubFee, env_1.lpFeeRate - 1);
        const slippageAmount = (0, helper_1.div)(value, slippage);
        const receivedAmount = value - slippageAmount;
        if (inp < Number(config.minRemainingSupply)) {
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: inp, amountWithSlipapge: receivedAmount };
    }
    else if (callMethod === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        // validation
        if (value < Number(config.minRemainingSupply)) {
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        const lbtcAmount = Number(pool.quote.value) - value;
        const constantRate = (0, helper_1.div)(lbtcAmount, env_1.quotePrecisionCoefficient);
        const x = (0, helper_1.div)(Number(pool.quote.value), env_1.quotePrecisionCoefficient);
        const y = (0, helper_1.div)(Number(pool.token.value), env_1.tokenPrecisionCoefficient);
        const constant = x * y;
        const usdtLiquidtyRate = (0, helper_1.div)(constant, constantRate);
        const totalUsdtLiquidity = usdtLiquidtyRate * env_1.tokenPrecisionCoefficient;
        const usdtAmountWithoutFee = totalUsdtLiquidity - Number(pool.token.value);
        const inp = (0, helper_1.div)(env_1.lpFeeRate * usdtAmountWithoutFee, env_1.lpFeeRate - 1);
        const slippageAmount = (0, helper_1.div)(value, slippage);
        const receivedAmount = value - slippageAmount;
        if (inp < Number(config.minTokenValue)) {
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: inp, amountWithSlipapge: receivedAmount };
    }
    return { amount: 0, amountWithSlipapge: 0 };
};
exports.convertForCtx2 = convertForCtx2;
const calcAddLiquidityRecipientValue = (pool, quoteAmount, tokenAmount) => {
    const user_provided_remaining_lbtc_supply = quoteAmount;
    const user_provided_remaining_lbtc_supply_16 = Math.floor(user_provided_remaining_lbtc_supply / 16);
    const pool_lp_supply = Number(pool.lp.value);
    const pool_lp_circulation = 2000000000 - pool_lp_supply;
    const mul_circ = user_provided_remaining_lbtc_supply_16 * pool_lp_circulation;
    const pool_lbtc_supply = Number(pool.quote.value);
    const pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / 16);
    const user_lp_receiving_1 = Math.floor(mul_circ / pool_lbtc_supply_down);
    const user_provided_token_supply = tokenAmount;
    const user_provided_token_supply_down = Math.floor(user_provided_token_supply / 2000000);
    const mul_circ2 = user_provided_token_supply_down * pool_lp_circulation;
    const pool_token_supply = Number(pool.token.value);
    const pool_token_supply_down = Math.floor(pool_token_supply / 2000000);
    const user_lp_receiving_2 = Math.floor(mul_circ2 / pool_token_supply_down);
    const user_lp_received = Math.min(user_lp_receiving_1, user_lp_receiving_2);
    const poolRate = user_lp_received / pool_lp_circulation;
    return { lpReceived: user_lp_received, poolRate };
};
exports.calcAddLiquidityRecipientValue = calcAddLiquidityRecipientValue;
const calcRemoveLiquidityRecipientValue = (pool, valLp) => {
    const user_lp_input = valLp;
    const pool_lbtc_supply = Number(pool.quote.value);
    const pool_token_supply = Number(pool.token.value);
    const pool_lp_supply = Number(pool.lp.value);
    const pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / 16);
    const mul_1 = user_lp_input * pool_lbtc_supply_down;
    const lp_circ = 2000000000 - pool_lp_supply;
    const div_1 = Math.floor(mul_1 / lp_circ);
    const user_lbtc_received = div_1 * 16;
    const pool_token_supply_down = Math.floor(pool_token_supply / 2000000);
    const mul_2 = user_lp_input * pool_token_supply_down;
    const div_2 = Math.floor(mul_2 / lp_circ);
    const user_token_received = div_2 * 2000000;
    return {
        user_lbtc_received,
        user_token_received,
    };
};
exports.calcRemoveLiquidityRecipientValue = calcRemoveLiquidityRecipientValue;
const convertForLiquidityCtx = (value, pool, config, isToken = false) => {
    if (isToken) {
        if (value < Number(config.minTokenValue)) {
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return 0;
        }
        const tokenInput = value;
        const quotePoolAmount = Number(pool.quote.value);
        const tokenPoolAmount = Number(pool.token.value);
        const quoteOutput = (0, helper_1.div)(tokenInput * quotePoolAmount, tokenPoolAmount);
        return quoteOutput;
    }
    else {
        if (value < Number(config.minRemainingSupply)) {
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return 0;
        }
        const quoteInput = value;
        const quotePoolAmount = Number(pool.quote.value);
        const tokenPoolAmount = Number(pool.token.value);
        const tokenOutput = (0, helper_1.div)(quoteInput * tokenPoolAmount, quotePoolAmount);
        return tokenOutput;
    }
};
exports.convertForLiquidityCtx = convertForLiquidityCtx;
//# sourceMappingURL=convertion.js.map