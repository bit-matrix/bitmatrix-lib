"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForLiquidityCtx = exports.calcRemoveLiquidityRecipientValue = exports.calcAddLiquidityRecipientValue = exports.convertForCtx2 = void 0;
var models_1 = require("@bitmatrix/models");
var pool_1 = require("./pool");
var helper_1 = require("./utils/helper");
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
    //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
    var pool_pair_1_liquidity_downgraded = Math.floor(pair_1_pool_supply / pair_1_coefficient);
    // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver
    var pool_pair_2_liquidity_downgraded = Math.floor(pair_2_pool_supply / pair_2_coefficient);
    // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
    var pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);
    var lpFeeTier = Object.values(pool_1.lpFeeTiers)[pool.lpFeeTierIndex.number];
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        // // step 1
        // const finalTokenPoolLiquidity = Math.floor(pair_2_pool_supply / pair_1_coefficient);
        // // step 2
        // const poolRateMulWithLbtcPoolRateMul = pair_2_pool_supply - finalTokenPoolLiquidity;
        var poolRateMulWithLbtcPoolRateMul = pair_2_pool_supply - value;
        // step 3
        var poolRateMulWithQuotePoolRate = (0, helper_1.div)(poolRateMulWithLbtcPoolRateMul, pair_2_coefficient);
        // step 4
        var quotePoolTotalAmountWithRate = (0, helper_1.div)(pool_constant, poolRateMulWithQuotePoolRate);
        // step 5
        var quotePoolTotalAmount = quotePoolTotalAmountWithRate * pair_1_coefficient;
        // step 6
        var quoteAmountSubFee = quotePoolTotalAmount - pair_1_pool_supply;
        var inp = (0, helper_1.div)(lpFeeTier * quoteAmountSubFee, lpFeeTier - 1);
        var slippageAmount = (0, helper_1.div)(value, slippage);
        var receivedAmount = value - slippageAmount;
        console.log(lpFeeTier * quoteAmountSubFee);
        if (inp < Math.floor(9 * pair_1_coefficient)) {
            console.log("2");
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: inp, amountWithSlipapge: receivedAmount };
    }
    else if (callMethod === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        var lbtcAmount = pair_1_pool_supply - value;
        var constantRate = (0, helper_1.div)(lbtcAmount, pair_1_coefficient);
        var tokenLiquidtyRate = (0, helper_1.div)(pool_constant, constantRate);
        var totalTokenLiquidity = tokenLiquidtyRate * pair_2_coefficient;
        var tokenAmountWithoutFee = totalTokenLiquidity - pair_2_pool_supply;
        var inp = (0, helper_1.div)(lpFeeTier * tokenAmountWithoutFee, lpFeeTier - 1);
        var slippageAmount = (0, helper_1.div)(value, slippage);
        var receivedAmount = value - slippageAmount;
        if (inp < Math.floor(9 * pair_2_coefficient)) {
            console.log("1");
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