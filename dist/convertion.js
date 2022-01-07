"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForCtx = void 0;
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
//# sourceMappingURL=convertion.js.map