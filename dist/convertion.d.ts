import { CALL_METHOD, Pool } from "@bitmatrix/models";
export declare const convertForCtx2: (value: number, slippage: number, pool: Pool, callMethod: CALL_METHOD) => {
    amount: number;
    amountWithSlipapge: number;
    minPair1Value: number;
    minPair2Value: number;
};
export declare const calcAddLiquidityRecipientValue: (pool: Pool, quoteAmount: number, tokenAmount: number) => {
    lpReceived: number;
    poolRate: number;
};
export declare const calcRemoveLiquidityRecipientValue: (pool: Pool, valLp: number) => {
    user_lbtc_received: number;
    user_token_received: number;
};
export declare const convertForLiquidityCtx: (value: number, pool: Pool, isToken?: boolean) => number;
