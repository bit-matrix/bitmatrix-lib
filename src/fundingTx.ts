import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { FundingOutput } from "./model/FundingOutput";

const fundingTx = (amount: number, pool: Pool, config: BmConfig, callMethod: CALL_METHOD): FundingOutput => {
  const fundingOutput1Value = amount;
  const fundingOutput2Value = config.baseFee.number + config.serviceFee.number + config.commitmentTxFee.number + config.defaultOrderingFee.number;

  const fundingOutput1Address = config.fundingOutputAddress;
  const fundingOutput2Address = config.fundingOutputAddress;

  let fundingOutput1AssetId = "";

  if (callMethod === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
    fundingOutput1AssetId = pool.quote.asset;
  } else if (callMethod === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
    fundingOutput1AssetId = pool.token.asset;
  }

  const fundingOutput2AssetId = pool.quote.asset;

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

export default fundingTx;
