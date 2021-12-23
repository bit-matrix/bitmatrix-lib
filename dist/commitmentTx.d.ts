import { BmConfig, Pool } from "@bitmatrix/models";
export declare const quoteToTokenCreateCommitmentTx: (inputAmount: number, txId: string, publicKey: string, calculatedAmountWithSlippage: number, config: BmConfig, pool: Pool) => string;
export declare const tokenToQuoteCreateCommitmentTx: (inputAmount: number, txId: string, publicKey: string, calculatedAmountWithSlippage: number, config: BmConfig, pool: Pool) => string;
