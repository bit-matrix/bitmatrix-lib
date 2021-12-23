import { BmConfig } from "@bitmatrix/models";
export declare const quoteToTokenCreateCommitmentTx: (inputAmount: number, txId: string, publicKey: string, calculatedAmountWithSlippage: number, config: BmConfig, quoteAssetId: string) => string;
export declare const tokenToQuoteCreateCommitmentTx: (inputAmount: number, txId: string, publicKey: string, tokenAssetId: string, quoteAssetId: string, calculatedAmountWithSlippage: number, config: BmConfig) => string;
