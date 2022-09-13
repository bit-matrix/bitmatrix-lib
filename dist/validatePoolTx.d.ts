import { CALL_METHOD, Pool } from "@bitmatrix/models";
export declare const validatePoolTx: (value: number, slippageTolerance: number, poolData: Pool, methodCall: CALL_METHOD) => {
    amount: number;
    amountWithSlipapge: number;
    minPair1Value: number;
    minPair2Value: number;
};
export declare const pairsCoefficientCalculation: (pool: Pool) => {
    pair1Coefficent: number;
    pair2coefficient: number;
};
