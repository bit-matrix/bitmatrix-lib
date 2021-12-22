import { FundingOutput } from "./model/FundingOutput";
export declare const lbtcToToken: (lbtcAmount: number, fundingOutputAdress: string, quoteAssetId: string, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
export declare const lbtcToTokenAmount: (lbtcAmount: number, slippage: number, minRemainingSupply: string) => number;
export declare const tokenToLBtc: (tokenAmount: number, fundingOutputAdress: string, quoteAssetId: string, tokenAssetId: string, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
export declare const tokenToLbtcAmount: (usdtAmount: number, slippage: number, minTokenValue: string) => number;
