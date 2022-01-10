"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcRemoveLiquidityRecipientValue = exports.calcAddLiquidityRecipientValue = exports.convertForCtx = void 0;
var models_1 = require("@bitmatrix/models");
var env_1 = require("./env");
var helper_1 = require("./utils/helper");
var convertForCtx = function (value, slippage, pool, config, callMethod) {
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        if (value < Number(config.minRemainingSupply)) {
            console.log("Quote amount must greater or at least minimum equal ".concat(config.minRemainingSupply));
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // step1  (lp fee calculate)
        var lpFee = (0, helper_1.div)(value, env_1.lpFeeRate);
        // step 2 (sub fee amount)
        var quoteAmountSubFee = value - lpFee;
        // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
        var quotePoolTotalAmount = Number(pool.quote.value) + quoteAmountSubFee;
        // step 4 (lbtPoolTotalAmount with rate 16)
        var quotePoolTotalAmountWithRate = (0, helper_1.div)(quotePoolTotalAmount, env_1.quotePrecisionCoefficient);
        // step 5 (lbtPoolAmount  with rate 16)
        var quotePoolAmountWithRate = (0, helper_1.div)(Number(pool.quote.value), env_1.quotePrecisionCoefficient);
        // step 6 (usdtPoolAmount  with rate 2 million)
        var usdtPoolAmountWithRate = (0, helper_1.div)(Number(pool.token.value), env_1.tokenPrecisionCoefficient);
        // step 7 (mul step 5 , step6)
        var poolRateMul = quotePoolAmountWithRate * usdtPoolAmountWithRate;
        // step 8 (div step7  step4)
        var poolRateMulWithQuotePoolRate = (0, helper_1.div)(poolRateMul, quotePoolTotalAmountWithRate);
        // step 9  (step8 * 2 million)
        var poolRateMulWithLbtcPoolRateMul = poolRateMulWithQuotePoolRate * env_1.tokenPrecisionCoefficient;
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
            console.log("Token amount must greater or at least minimum equal ".concat(config.minTokenValue));
            return { amount: 0, amountWithSlipapge: 0 };
        }
        // step1 (fee calculation)
        var lpFee = (0, helper_1.div)(value, env_1.lpFeeRate);
        // step2 (input new value without fee  input - step1)
        var usdtAmountWithoutFee = value - lpFee;
        // step3 (total token pool amount poolUsdtLiquidity + step2)
        var totalUsdtLiquidity = Number(pool.token.value) + usdtAmountWithoutFee;
        // step4  (usdt Liquidty rate calculation step3 % 2mn)
        var usdtLiquidtyRate = (0, helper_1.div)(totalUsdtLiquidity, env_1.tokenPrecisionCoefficient);
        // step5 (Pool L-BTC liquidity % 16)
        var x = (0, helper_1.div)(Number(pool.quote.value), env_1.quotePrecisionCoefficient);
        // step6 (Pool Token liquidity % 2MN)
        var y = (0, helper_1.div)(Number(pool.token.value), env_1.tokenPrecisionCoefficient);
        // step 7 (constant x*y = k step5*step6)
        var constant = x * y;
        // step 8 (constant * usdtLiquidtyRate  step7*step4
        var constantRate = (0, helper_1.div)(constant, usdtLiquidtyRate);
        //step 9 (step 8 * 16)
        var lbtcAmount = constantRate * env_1.quotePrecisionCoefficient;
        //step 10 (poolLbtcLiquidity - step9)
        var tokenValue = Number(pool.quote.value) - lbtcAmount;
        var slippageAmount = (0, helper_1.div)(tokenValue, slippage);
        var receivedAmount = tokenValue - slippageAmount;
        return { amount: tokenValue, amountWithSlipapge: receivedAmount };
    }
    else if (callMethod === models_1.CALL_METHOD.ADD_LIQUIDITY) {
        if (value < Number(config.minRemainingSupply)) {
            console.log("Quote amount must greater or at least minimum equal ".concat(config.minRemainingSupply));
            return { amount: 0, amountWithSlipapge: 0 };
        }
        var quoteInput = value;
        var quotePoolAmount = Number(pool.quote.value);
        var tokenPoolAmount = Number(pool.token.value);
        var tokenOutput = (0, helper_1.div)(quoteInput * tokenPoolAmount, quotePoolAmount);
        return { amount: tokenOutput, amountWithSlipapge: 0 };
    }
    return { amount: 0, amountWithSlipapge: 0 };
};
exports.convertForCtx = convertForCtx;
var calcAddLiquidityRecipientValue = function (pool, quoteAmount, tokenAmount) {
    var user_provided_remaining_lbtc_supply = quoteAmount;
    var user_provided_remaining_lbtc_supply_16 = Math.floor(user_provided_remaining_lbtc_supply / 16);
    var pool_lp_supply = Number(pool.lp.value);
    var pool_lp_circulation = 2000000000 - pool_lp_supply;
    var mul_circ = user_provided_remaining_lbtc_supply_16 * pool_lp_circulation;
    var pool_lbtc_supply = Number(pool.quote.value);
    var pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / 16);
    var user_lp_receiving_1 = Math.floor(mul_circ / pool_lbtc_supply_down);
    var user_provided_token_supply = tokenAmount;
    var user_provided_token_supply_down = Math.floor(user_provided_token_supply / 2000000);
    var mul_circ2 = user_provided_token_supply_down * pool_lp_circulation;
    var pool_token_supply = Number(pool.token.value);
    var pool_token_supply_down = Math.floor(pool_token_supply / 2000000);
    var user_lp_receiving_2 = Math.floor(mul_circ2 / pool_token_supply_down);
    var user_lp_received = Math.min(user_lp_receiving_1, user_lp_receiving_2);
    var poolRate = user_lp_received / pool_lp_circulation;
    return { lpReceived: user_lp_received, poolRate: poolRate };
};
exports.calcAddLiquidityRecipientValue = calcAddLiquidityRecipientValue;
var calcRemoveLiquidityRecipientValue = function (pool, valLp) {
    var user_lp_input = valLp;
    var pool_lbtc_supply = Number(pool.quote.value);
    var pool_token_supply = Number(pool.token.value);
    var pool_lp_supply = Number(pool.lp.value);
    var pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / 16);
    var mul_1 = user_lp_input * pool_lbtc_supply_down;
    var lp_circ = 2000000000 - pool_lp_supply;
    var div_1 = Math.floor(mul_1 / lp_circ);
    var user_lbtc_received = div_1 * 16;
    var pool_token_supply_down = Math.floor(pool_token_supply / 2000000);
    var mul_2 = user_lp_input * pool_token_supply_down;
    var div_2 = Math.floor(mul_2 / lp_circ);
    var user_token_received = div_2 * 2000000;
    return {
        user_lbtc_received: user_lbtc_received,
        user_token_received: user_token_received,
    };
};
exports.calcRemoveLiquidityRecipientValue = calcRemoveLiquidityRecipientValue;
//# sourceMappingURL=convertion.js.map