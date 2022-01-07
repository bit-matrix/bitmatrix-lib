import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { FundingOutput } from "./model/FundingOutput";
declare const fundingTxForLiquidity: (quoteAmount: number, tokenAmount: number, pool: Pool, config: BmConfig, callMethod?: CALL_METHOD | undefined) => FundingOutput;
export default fundingTxForLiquidity;
