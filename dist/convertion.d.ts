import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
export declare const convertForCtx: (value: number, slippage: number, pool: Pool, config: BmConfig, callMethod: CALL_METHOD) => {
    amount: number;
    amountWithSlipapge: number;
};
