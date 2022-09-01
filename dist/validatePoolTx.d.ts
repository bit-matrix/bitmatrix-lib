import { CALL_METHOD, Pool } from "@bitmatrix/models";
export declare const validatePoolTx: (value: number, slippageTolerance: number, poolData: Pool, methodCall: CALL_METHOD, additionalValue?: number) => {
    amount: number;
    amountWithSlipapge: number;
};
