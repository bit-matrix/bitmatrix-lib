"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForLiquidityCtx = exports.calcRemoveLiquidityRecipientValue = exports.calcAddLiquidityRecipientValue = exports.convertForCtx2 = exports.convertForCtx = void 0;
var models_1 = require("@bitmatrix/models");
var pool_1 = require("./pool");
var helper_1 = require("./utils/helper");
var convertForCtx = function (value, slippage, pool, config, callMethod) {
    var pair_1_coefficient = pool.pair1_coefficient.number;
    var pair_1_pool_supply = Number(pool.quote.value);
    var pair_2_pool_supply = Number(pool.token.value);
    var pair_2_coefficient;
    if (pair_2_pool_supply >= pair_1_pool_supply) {
        pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
    }
    else {
        pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
    }
    if (pair_2_coefficient < 1) {
        pair_2_coefficient = 1;
    }
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        if (value < Number(config.minRemainingSupply)) {
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // step1  (lp fee calculate)
        var lpFee = (0, helper_1.div)(value, pool.lpFeeTierIndex.number);
        // step 2 (sub fee amount)
        var quoteAmountSubFee = value - lpFee;
        // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
        var quotePoolTotalAmount = Number(pool.quote.value) + quoteAmountSubFee;
        // step 4 (lbtPoolTotalAmount with rate 16)
        var quotePoolTotalAmountWithRate = (0, helper_1.div)(quotePoolTotalAmount, pair_1_coefficient);
        // step 5 (lbtPoolAmount  with rate 16)
        var quotePoolAmountWithRate = (0, helper_1.div)(Number(pool.quote.value), pair_1_coefficient);
        // step 6 (tokenPoolAmount  with rate 2 million)
        var tokenPoolAmountWithRate = (0, helper_1.div)(Number(pool.token.value), pair_2_coefficient);
        // step 7 (mul step 5 , step6)
        var poolRateMul = quotePoolAmountWithRate * tokenPoolAmountWithRate;
        // step 8 (div step7  step4)
        var poolRateMulWithQuotePoolRate = (0, helper_1.div)(poolRateMul, quotePoolTotalAmountWithRate);
        // step 9  (step8 * 2 million)
        var poolRateMulWithLbtcPoolRateMul = poolRateMulWithQuotePoolRate * pair_2_coefficient;
        // step 10  (Pool Token liquidity - 9.step)
        var finalTokenPoolLiquidity = Number(pool.token.value) - poolRateMulWithLbtcPoolRateMul;
        //step11 ( step 10 - 1milion)
        var tokenAmount = finalTokenPoolLiquidity - config.recipientValueMinus;
        var slippageAmount = (0, helper_1.div)(tokenAmount, slippage);
        var receivedAmount = tokenAmount - slippageAmount;
        return { amount: tokenAmount, amountWithSlipapge: receivedAmount };
    }
    else if (callMethod === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        // validation
        if (value < Number(config.minTokenValue)) {
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // step1 (fee calculation)
        var lpFee = (0, helper_1.div)(value, pool.lpFeeTierIndex.number);
        // step2 (input new value without fee  input - step1)
        var tokenAmountWithoutFee = value - lpFee;
        // step3 (total token pool amount poolTokenLiquidity + step2)
        var totalTokenLiquidity = pair_2_pool_supply + tokenAmountWithoutFee;
        // step4  (token Liquidty rate calculation step3 % 2mn)
        var tokenLiquidtyRate = (0, helper_1.div)(totalTokenLiquidity, pair_2_coefficient);
        // step5 (Pool L-BTC liquidity % 16)
        var x = (0, helper_1.div)(pair_1_pool_supply, pair_1_coefficient);
        // step6 (Pool Token liquidity % 2MN)
        var y = (0, helper_1.div)(pair_2_pool_supply, pair_2_coefficient);
        // step 7 (constant x*y = k step5*step6)
        var constant = x * y;
        // step 8 (constant * tokenLiquidtyRate  step7*step4
        var constantRate = (0, helper_1.div)(constant, tokenLiquidtyRate);
        //step 9 (step 8 * 16)
        var lbtcAmount = constantRate * pair_1_coefficient;
        //step 10 (poolLbtcLiquidity - step9)
        var tokenValue = pair_1_pool_supply - lbtcAmount;
        var slippageAmount = (0, helper_1.div)(tokenValue, slippage);
        var receivedAmount = tokenValue - slippageAmount;
        return { amount: tokenValue, amountWithSlipapge: receivedAmount };
    }
    return { amount: 0, amountWithSlipapge: 0 };
};
exports.convertForCtx = convertForCtx;
var convertForCtx2 = function (value, slippage, pool, config, callMethod) {
    var pair_1_coefficient = pool.pair1_coefficient.number;
    var pair_1_pool_supply = Number(pool.quote.value);
    var pair_2_pool_supply = Number(pool.token.value);
    var pair_2_coefficient;
    if (pair_2_pool_supply >= pair_1_pool_supply) {
        pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
    }
    else {
        pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
    }
    if (pair_2_coefficient < 1) {
        pair_2_coefficient = 1;
    }
    var lpFeeTier = Object.values(pool_1.lpFeeTiers)[pool.lpFeeTierIndex.number];
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        if (value < 10 * pair_1_coefficient) {
            console.log("1");
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // extra
        var quotePoolAmountWithRate = (0, helper_1.div)(pair_1_pool_supply, pair_1_coefficient);
        var tokenPoolAmountWithRate = (0, helper_1.div)(pair_2_pool_supply, pair_2_coefficient);
        var poolRateMul = quotePoolAmountWithRate * tokenPoolAmountWithRate;
        // step 1
        var finalTokenPoolLiquidity = value + config.recipientValueMinus;
        // step 2
        var poolRateMulWithLbtcPoolRateMul = finalTokenPoolLiquidity - pair_2_pool_supply;
        // step 3
        var poolRateMulWithQuotePoolRate = (0, helper_1.div)(poolRateMulWithLbtcPoolRateMul, pair_2_coefficient);
        // step 4
        var quotePoolTotalAmountWithRate = (0, helper_1.div)(poolRateMul, poolRateMulWithQuotePoolRate);
        // step 5
        var quotePoolTotalAmount = quotePoolTotalAmountWithRate * pair_1_coefficient;
        // step 6
        var quoteAmountSubFee = quotePoolTotalAmount - pair_1_pool_supply;
        var inp = (0, helper_1.div)(lpFeeTier * quoteAmountSubFee, lpFeeTier - 1);
        var slippageAmount = (0, helper_1.div)(value, slippage);
        var receivedAmount = value - slippageAmount;
        console.log(lpFeeTier * quoteAmountSubFee);
        if (inp < 10 * pair_1_coefficient) {
            console.log("2");
            // console.log(`Quote amount must greater or at least minimum equal ${config.minRemainingSupply}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: inp, amountWithSlipapge: receivedAmount };
    }
    else if (callMethod === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        // validation
        if (value < 10 * pair_2_coefficient) {
            console.log("3");
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        var lbtcAmount = pair_1_pool_supply - value;
        var constantRate = (0, helper_1.div)(lbtcAmount, pair_1_coefficient);
        var x = (0, helper_1.div)(pair_1_pool_supply, pair_1_coefficient);
        var y = (0, helper_1.div)(pair_2_pool_supply, pair_2_coefficient);
        var constant = x * y;
        var tokenLiquidtyRate = (0, helper_1.div)(constant, constantRate);
        var totalTokenLiquidity = tokenLiquidtyRate * pair_2_coefficient;
        var tokenAmountWithoutFee = totalTokenLiquidity - pair_2_pool_supply;
        var inp = (0, helper_1.div)(lpFeeTier * tokenAmountWithoutFee, lpFeeTier - 1);
        var slippageAmount = (0, helper_1.div)(value, slippage);
        var receivedAmount = value - slippageAmount;
        if (inp < 10 * pair_2_coefficient) {
            console.log("4");
            // console.log(`Token amount must greater or at least minimum equal ${config.minTokenValue}`);
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: inp, amountWithSlipapge: receivedAmount };
    }
    return { amount: 0, amountWithSlipapge: 0 };
};
exports.convertForCtx2 = convertForCtx2;
var calcAddLiquidityRecipientValue = function (pool, quoteAmount, tokenAmount) {
    var user_provided_remaining_lbtc_supply = quoteAmount;
    var user_provided_remaining_lbtc_supply_16 = Math.floor(user_provided_remaining_lbtc_supply / 16);
    var pool_lp_supply = Number(pool.lp.value);
    var pair_1_pool_supply = Number(pool.quote.value);
    var pair_2_pool_supply = Number(pool.token.value);
    var pool_lp_circulation = 2000000000 - pool_lp_supply;
    var mul_circ = user_provided_remaining_lbtc_supply_16 * pool_lp_circulation;
    var pool_lbtc_supply = Number(pool.quote.value);
    var pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / pool.pair1_coefficient.number);
    var user_lp_receiving_1 = Math.floor(mul_circ / pool_lbtc_supply_down);
    var user_provided_token_supply = tokenAmount;
    var pair_2_coefficient;
    if (pair_2_pool_supply >= pair_1_pool_supply) {
        pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pool.pair1_coefficient.number;
    }
    else {
        pair_2_coefficient = Math.floor(pool.pair1_coefficient.number / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
    }
    if (pair_2_coefficient < 1) {
        pair_2_coefficient = 1;
    }
    var user_provided_token_supply_down = Math.floor(user_provided_token_supply / pair_2_coefficient);
    var mul_circ2 = user_provided_token_supply_down * pool_lp_circulation;
    var pool_token_supply = Number(pool.token.value);
    var pool_token_supply_down = Math.floor(pool_token_supply / pair_2_coefficient);
    var user_lp_receiving_2 = Math.floor(mul_circ2 / pool_token_supply_down);
    var user_lp_received = Math.min(user_lp_receiving_1, user_lp_receiving_2);
    var poolRate = user_lp_received / (pool_lp_circulation + user_lp_received);
    return { lpReceived: user_lp_received, poolRate: poolRate };
};
exports.calcAddLiquidityRecipientValue = calcAddLiquidityRecipientValue;
var calcRemoveLiquidityRecipientValue = function (pool, valLp) {
    var user_lp_input = valLp;
    var pool_lbtc_supply = Number(pool.quote.value);
    var pool_token_supply = Number(pool.token.value);
    var pool_lp_supply = Number(pool.lp.value);
    var pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / pool.pair1_coefficient.number);
    var mul_1 = user_lp_input * pool_lbtc_supply_down;
    var lp_circ = 2000000000 - pool_lp_supply;
    var div_1 = Math.floor(mul_1 / lp_circ);
    var user_lbtc_received = div_1 * pool.pair1_coefficient.number;
    var pair_2_coefficient;
    if (pool_token_supply >= pool_lbtc_supply) {
        pair_2_coefficient = Math.floor(pool_token_supply / pool_lbtc_supply) * pool.pair1_coefficient.number;
    }
    else {
        pair_2_coefficient = Math.floor(pool.pair1_coefficient.number / Math.floor(pool_lbtc_supply / pool_token_supply));
    }
    if (pair_2_coefficient < 1) {
        pair_2_coefficient = 1;
    }
    var pool_token_supply_down = Math.floor(pool_token_supply / pair_2_coefficient);
    var mul_2 = user_lp_input * pool_token_supply_down;
    var div_2 = Math.floor(mul_2 / lp_circ);
    var user_token_received = div_2 * pair_2_coefficient;
    return {
        user_lbtc_received: user_lbtc_received,
        user_token_received: user_token_received,
    };
};
exports.calcRemoveLiquidityRecipientValue = calcRemoveLiquidityRecipientValue;
var convertForLiquidityCtx = function (value, pool, isToken) {
    if (isToken === void 0) { isToken = false; }
    if (isToken) {
        var tokenInput = value;
        var quotePoolAmount = Number(pool.quote.value);
        var tokenPoolAmount = Number(pool.token.value);
        var quoteOutput = (0, helper_1.div)(tokenInput * quotePoolAmount, tokenPoolAmount);
        return quoteOutput;
    }
    else {
        var quoteInput = value;
        var quotePoolAmount = Number(pool.quote.value);
        var tokenPoolAmount = Number(pool.token.value);
        var tokenOutput = (0, helper_1.div)(quoteInput * tokenPoolAmount, quotePoolAmount);
        return tokenOutput;
    }
};
exports.convertForLiquidityCtx = convertForLiquidityCtx;
//# sourceMappingURL=convertion.js.map