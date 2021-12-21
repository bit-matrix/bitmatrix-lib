import { FundingOutput } from "./model/FundingOutput";
export declare const lbtcToTokenSwap: (lbtcAmount: number, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
export declare const lbtcToTokenSwapAmountCalculate: (lbtcAmount: number, slippage: number) => number;
export declare const tokenToLbtcSwapAmountCalculate: (usdtAmount: number, slippage: number) => number;
export declare const tokenToLBtcSwap: (usdtAmount: number, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
