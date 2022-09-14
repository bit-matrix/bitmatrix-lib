import { BmConfig, Pool } from "@bitmatrix/models";
import { Wallet } from "./wallet";
export declare const case1: (wallet: Wallet, inputAmount: number, calculatedAmountWithSlippage: number, pool: Pool, config: BmConfig, publicKey: string, feeAssetHash: string, isTestnet?: boolean) => Promise<string>;
export declare const case2: (wallet: Wallet, inputAmount: number, calculatedAmountWithSlippage: number, pool: Pool, config: BmConfig, publicKey: string, feeAssetHash: string, isTestnet?: boolean) => Promise<string>;
export declare const case3: (wallet: Wallet, inputAmountPair1: number, inputAmountPair2: number, pool: Pool, config: BmConfig, publicKey: string, feeAssetHash: string, isTestnet?: boolean) => Promise<string>;
export declare const case4: (wallet: Wallet, lpAmount: number, pool: Pool, config: BmConfig, publicKey: string, feeAssetHash: string, isTestnet?: boolean) => Promise<string>;
