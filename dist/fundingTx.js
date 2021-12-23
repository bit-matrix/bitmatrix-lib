"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenToLBtc = exports.lbtcToToken = void 0;
var lbtcToToken = function (lbtcAmount, fundingOutputAdress, quoteAssetId, baseFee, serviceFee, commitmentTxFee, orderingFee) {
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
exports.lbtcToToken = lbtcToToken;
var tokenToLBtc = function (tokenAmount, fundingOutputAdress, quoteAssetId, tokenAssetId, baseFee, serviceFee, commitmentTxFee, orderingFee) {
    var fundingOutput1Value = tokenAmount;
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
exports.tokenToLBtc = tokenToLBtc;
//# sourceMappingURL=fundingTx.js.map