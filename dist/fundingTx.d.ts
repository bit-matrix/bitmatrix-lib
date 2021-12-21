import { FundingOutput } from "./model/FundingOutput";
export declare const lbtcToTokenSwap: (lbtcAmount: number, fundingOutputAdress: string, quoteAssetId: string, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
export declare const lbtcToTokenSwapAmountCalculate: (lbtcAmount: number, slippage: number, minRemainingSupply: string) => number;
export declare const tokenToLbtcSwapAmountCalculate: (usdtAmount: number, slippage: number, minTokenValue: string) => number;
export declare const tokenToLBtcSwap: (usdtAmount: number, fundingOutputAdress: string, quoteAssetId: string, tokenAssetId: string, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
