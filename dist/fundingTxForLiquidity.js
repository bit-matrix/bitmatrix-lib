"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fundingTxForLiquidity = function (quoteAmount, tokenAmount, pool, config, callMethod) {
    var totalFee = config.baseFee.number + config.serviceFee.number + config.commitmentTxFee.number + config.defaultOrderingFee.number;
    var fundingOutput1Value = quoteAmount + totalFee;
    var fundingOutput2Value = tokenAmount;
    var fundingOutput1Address = config.fundingOutputAddress;
    var fundingOutput2Address = config.fundingOutputAddress;
    var fundingOutput1AssetId = pool.quote.asset;
    var fundingOutput2AssetId = pool.token.asset;
    return {
        fundingOutput1Value: fundingOutput1Value,
        fundingOutput2Value: fundingOutput2Value,
        fundingOutput1Address: fundingOutput1Address,
        fundingOutput2Address: fundingOutput2Address,
        fundingOutput1AssetId: fundingOutput1AssetId,
        fundingOutput2AssetId: fundingOutput2AssetId,
    };
};
exports.default = fundingTxForLiquidity;
//# sourceMappingURL=fundingTxForLiquidity.js.map