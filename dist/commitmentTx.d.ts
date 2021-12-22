export declare const lbtcToTokenCreateCommitmentTx: (inputAmount: number, txId: string, publicKey: string, calculatedAmountWithSlippage: number, orderingFee: {
    number: number;
    hex: string;
}, baseFee: {
    number: number;
    hex: string;
}, commitmentTxFee: {
    number: number;
    hex: string;
}, internalKey: string) => string;
export declare const tokenToLbtcCreateCommitmentTx: (inputAmount: number, txId: string, publicKey: string, calculatedAmountWithSlippage: number, orderingFee: {
    number: number;
    hex: string;
}, baseFee: {
    number: number;
    hex: string;
}, serviceFee: {
    number: number;
    hex: string;
}, commitmentTxFee: {
    number: number;
    hex: string;
}, internalKey: string) => string;
