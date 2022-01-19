import { BmConfig, CALL_METHOD, Pool } from "@bitmatrix/models";
export declare const convertForCtx: (value: number, slippage: number, pool: Pool, config: BmConfig, callMethod: CALL_METHOD) => {
    amount: number;
    amountWithSlipapge: number;
};
export declare const convertForCtx2: (value: number, slippage: number, pool: Pool, config: BmConfig, callMethod: CALL_METHOD) => {
    amount: number;
    amountWithSlipapge: number;
};
export declare const calcAddLiquidityRecipientValue: (pool: Pool, quoteAmount: number, tokenAmount: number) => {
    lpReceived: number;
    poolRate: number;
};
export declare const calcRemoveLiquidityRecipientValue: (pool: Pool, valLp: number) => {
    user_lbtc_received: number;
    user_token_received: number;
};
export declare const convertForLiquidityCtx: (value: number, pool: Pool, config: BmConfig, isToken?: boolean) => number;
