"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenToLBtcSwap = exports.tokenToLbtcSwapAmountCalculate = exports.lbtcToTokenSwapAmountCalculate = exports.lbtcToTokenSwap = void 0;
var env_1 = require("./env");
var helper_1 = require("./utils/helper");
var lbtcToTokenSwap = function (lbtcAmount, fundingOutputAdress, quoteAssetId, baseFee, serviceFee, commitmentTxFee, orderingFee) {
    // lbtc satoshi amount with slippage
    var fundingOutput1Value = lbtcAmount;
    var fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;
    var fundingOutput1Address = fundingOutputAdress;
    var fundingOutput2Address = fundingOutputAdress;
    var fundingOutput1AssetId = quoteAssetId;
    var fundingOutput2AssetId = quoteAssetId;
    return {
        fundingOutput1Value: fundingOutput1Value,
        fundingOutput2Value: fundingOutput2Value,
        fundingOutput1Address: fundingOutput1Address,
        fundingOutput2Address: fundingOutput2Address,
        fundingOutput1AssetId: fundingOutput1AssetId,
        fundingOutput2AssetId: fundingOutput2AssetId,
    };
};
exports.lbtcToTokenSwap = lbtcToTokenSwap;
// all amounts satoshi
var lbtcToTokenSwapAmountCalculate = function (lbtcAmount, slippage, minRemainingSupply) {
    // validation
    if (lbtcAmount < Number(minRemainingSupply)) {
        console.log("Lbtc amount must greater or at least minimum equal ".concat(minRemainingSupply));
        return 0;
    }
    // step1   (lp fee calculate)
    var lpFee = (0, helper_1.div)(lbtcAmount, env_1.lpFeeRate);
    // step 2 (sub fee amount)
    var lbtcAmountSubFee = lbtcAmount - lpFee;
    // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
    var lbtcPoolTotalAmount = env_1.poolLbtcLiquidity + lbtcAmountSubFee;
    // step 4 (lbtPoolTotalAmount with rate 16)
    var lbtcPoolTotalAmountWithRate = (0, helper_1.div)(lbtcPoolTotalAmount, env_1.quotePrecisionCoefficient);
    // step 5 (lbtPoolAmount  with rate 16)
    var lbtcPoolAmountWithRate = (0, helper_1.div)(env_1.poolLbtcLiquidity, env_1.quotePrecisionCoefficient);
    // step 6 (usdtPoolAmount  with rate 2 million)
    var usdtPoolAmountWithRate = (0, helper_1.div)(env_1.poolTokenLiquidity, env_1.tokenPrecisionCoefficient);
    // step 7 (mul step 5 , step6)
    var poolRateMul = lbtcPoolAmountWithRate * usdtPoolAmountWithRate;
    // step 8 (div step7  step4)
    var poolRateMulWithLbtcPoolRate = (0, helper_1.div)(poolRateMul, lbtcPoolTotalAmountWithRate);
    // step 9  (step8 * 2 million)
    var poolRateMulWithLbtcPoolRateMul = poolRateMulWithLbtcPoolRate * env_1.tokenPrecisionCoefficient;
    // step 10  (Pool Token liquidity - 9.step)
    var finalTokenPoolLiquidity = env_1.poolTokenLiquidity - poolRateMulWithLbtcPoolRateMul;
    //step11 ( step 10 - 1milion)
    var tokenAmount = finalTokenPoolLiquidity - 1000000;
    // step 12 slippage amount calculation with slippage
    var slippageAmount = (0, helper_1.div)(tokenAmount, slippage);
    var finalAmount = tokenAmount - slippageAmount;
    return finalAmount;
};
exports.lbtcToTokenSwapAmountCalculate = lbtcToTokenSwapAmountCalculate;
var tokenToLbtcSwapAmountCalculate = function (usdtAmount, slippage, minTokenValue) {
    // validation
    if (usdtAmount < Number(minTokenValue)) {
        console.log("Usdt amount must greater or at least minimum equal ".concat(minTokenValue));
        return 0;
    }
    // step1 (fee calculation)
    var lpFee = (0, helper_1.div)(usdtAmount, env_1.lpFeeRate);
    // step2 (input new value without fee  input - step1)
    var usdtAmountWithoutFee = usdtAmount - lpFee;
    // step3 (total usd pool amount poolUsdtLiquidity + step2)
    var totalUsdtLiquidity = env_1.poolTokenLiquidity + usdtAmountWithoutFee;
    // step4  (usdt Liquidty rate calculation step3 % 2mn)
    var usdtLiquidtyRate = (0, helper_1.div)(totalUsdtLiquidity, env_1.tokenPrecisionCoefficient);
    // step5 (Pool L-BTC liquidity % 16)
    var x = (0, helper_1.div)(env_1.poolLbtcLiquidity, env_1.quotePrecisionCoefficient);
    // step6 (Pool Token liquidity % 2MN)
    var y = (0, helper_1.div)(env_1.poolTokenLiquidity, env_1.tokenPrecisionCoefficient);
    // step 7 (constant x*y = k step5*step6)
    var constant = x * y;
    // step 8 (constant * usdtLiquidtyRate  step7*step4
    var constantRate = (0, helper_1.div)(constant, usdtLiquidtyRate);
    //step 9 (step 8 * 16)
    var lbtcAmount = constantRate * env_1.quotePrecisionCoefficient;
    //step 10 (poolLbtcLiquidity - step9)
    var remainingLbtcAmount = env_1.poolLbtcLiquidity - lbtcAmount;
    var slippageAmount = (0, helper_1.div)(remainingLbtcAmount, slippage);
    var finalAmount = remainingLbtcAmount - slippageAmount;
    return finalAmount;
};
exports.tokenToLbtcSwapAmountCalculate = tokenToLbtcSwapAmountCalculate;
var tokenToLBtcSwap = function (usdtAmount, fundingOutputAdress, quoteAssetId, tokenAssetId, baseFee, serviceFee, commitmentTxFee, orderingFee) {
    var fundingOutput1Value = usdtAmount;
    var fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;
    var fundingOutput1Address = fundingOutputAdress;
    var fundingOutput2Address = fundingOutputAdress;
    // token asset id
    var fundingOutput1AssetId = tokenAssetId;
    // lbtc asset id
    var fundingOutput2AssetId = quoteAssetId;
    return {
        fundingOutput1Value: fundingOutput1Value,
        fundingOutput2Value: fundingOutput2Value,
        fundingOutput1Address: fundingOutput1Address,
        fundingOutput2Address: fundingOutput2Address,
        fundingOutput1AssetId: fundingOutput1AssetId,
        fundingOutput2AssetId: fundingOutput2AssetId,
    };
};
exports.tokenToLBtcSwap = tokenToLBtcSwap;
//# sourceMappingURL=fundingTx.js.map