import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
import { FundingOutput } from "./model/FundingOutput";
declare const fundingTx: (amount: number, pool: Pool, config: BmConfig, callMethod: CALL_METHOD) => FundingOutput;
export default fundingTx;
