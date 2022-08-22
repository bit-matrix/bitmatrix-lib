export declare const poolDeploy: (txId: string, quoteAssetId: string, tokenAssetId: string, quoteAmount: number, tokenAmount: number, userPubkey: string, poolVersion: number, pair1Coefficient: number, lpFeeTierIndex: number) => string;
export declare const calculateInitialLpCirculation: (pair1Coefficient: number, pair1Amount: number) => number;
