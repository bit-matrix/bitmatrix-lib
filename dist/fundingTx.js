"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("@bitmatrix/models");
var fundingTx = function (amount, pool, config, callMethod) {
    var fundingOutput1Value = amount;
    var fundingOutput2Value = config.baseFee.number + config.serviceFee.number + config.commitmentTxFee.number + config.defaultOrderingFee.number;
    var fundingOutput1Address = config.fundingOutputAddress;
    var fundingOutput2Address = config.fundingOutputAddress;
    var fundingOutput1AssetId = "";
    if (callMethod === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        fundingOutput1AssetId = pool.quote.asset;
    }
    else if (callMethod === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        fundingOutput1AssetId = pool.token.asset;
    }
    var fundingOutput2AssetId = pool.quote.asset;
    return {
        fundingOutput1Value: fundingOutput1Value,
        fundingOutput2Value: fundingOutput2Value,
        fundingOutput1Address: fundingOutput1Address,
        fundingOutput2Address: fundingOutput2Address,
        fundingOutput1AssetId: fundingOutput1AssetId,
        fundingOutput2AssetId: fundingOutput2AssetId,
    };
};
exports.default = fundingTx;
//# sourceMappingURL=fundingTx.js.map