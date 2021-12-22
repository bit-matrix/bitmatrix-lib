import { lpFeeRate, poolLbtcLiquidity, poolTokenLiquidity, quotePrecisionCoefficient, tokenPrecisionCoefficient } from "./env";
import { FundingOutput } from "./model/FundingOutput";
import { div } from "./utils/helper";

export const lbtcToToken = (
  lbtcAmount: number,
  fundingOutputAdress: string,
  quoteAssetId: string,
  baseFee: number,
  serviceFee: number,
  commitmentTxFee: number,
  orderingFee: number
): FundingOutput => {
  // lbtc satoshi amount with slippage
  const fundingOutput1Value = lbtcAmount;
  const fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;

  const fundingOutput1Address = fundingOutputAdress;
  const fundingOutput2Address = fundingOutputAdress;

  const fundingOutput1AssetId = quoteAssetId;
  const fundingOutput2AssetId = quoteAssetId;

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

export const tokenToLBtc = (
  tokenAmount: number,
  fundingOutputAdress: string,
  quoteAssetId: string,
  tokenAssetId: string,
  baseFee: number,
  serviceFee: number,
  commitmentTxFee: number,
  orderingFee: number
): FundingOutput => {
  const fundingOutput1Value = tokenAmount;

  const fundingOutput2Value = baseFee + serviceFee + commitmentTxFee + orderingFee;

  const fundingOutput1Address = fundingOutputAdress;
  const fundingOutput2Address = fundingOutputAdress;

  // token asset id
  const fundingOutput1AssetId = tokenAssetId;

  // lbtc asset id
  const fundingOutput2AssetId = quoteAssetId;

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};
