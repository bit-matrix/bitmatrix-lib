import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { FundingOutput } from "./model/FundingOutput";

const fundingTxForLiquidity = (quoteAmount: number, tokenAmount: number, pool: Pool, config: BmConfig, callMethod: CALL_METHOD): FundingOutput => {
  const totalFee = config.baseFee.number + config.serviceFee.number + config.commitmentTxFee.number + config.defaultOrderingFee.number;

  const fundingOutput1Value = quoteAmount + totalFee;
  const fundingOutput2Value = tokenAmount;

  const fundingOutput1Address = config.fundingOutputAddress;
  const fundingOutput2Address = config.fundingOutputAddress;

  const fundingOutput1AssetId = pool.quote.assetHash;

  let fundingOutput2AssetId = "";

  if (callMethod === CALL_METHOD.ADD_LIQUIDITY) {
    fundingOutput2AssetId = pool.token.assetHash;
  } else if (callMethod === CALL_METHOD.REMOVE_LIQUIDITY) {
    fundingOutput2AssetId = pool.lp.assetHash;
  }

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

export default fundingTxForLiquidity;
