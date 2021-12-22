import { FundingOutput } from "./model/FundingOutput";
export declare const lbtcToToken: (lbtcAmount: number, fundingOutputAdress: string, quoteAssetId: string, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
export declare const tokenToLBtc: (tokenAmount: number, fundingOutputAdress: string, quoteAssetId: string, tokenAssetId: string, baseFee: number, serviceFee: number, commitmentTxFee: number, orderingFee: number) => FundingOutput;
