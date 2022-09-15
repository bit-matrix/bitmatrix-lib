import { Pool } from "@bitmatrix/models";
export declare const lpFeeTiers: {
    [key: string]: number;
};
export declare const bandwithArray: number[];
export declare const bodyCalculaterN: (n: number, flagAssetId: string, pair1Coefficient?: number, lpFeeTierIndex?: number) => string;
export declare const createCovenants: (leafCount: number, lookupLeafIndex: number, flagAssetId: string, pair1Coefficient: number, lpFeeTierIndex: number) => {
    mainCovenantScript: string[];
    controlBlock: string;
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
};
export declare const minimumPairValues: (pool: Pool) => {
    minPair1Value: number;
    minPair2Value: number;
};
