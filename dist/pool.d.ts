export declare const bodyCalculaterN: (n: number, flagAssetId: string) => string;
export declare const createCovenants: (leafCount: number, lookupLeafIndex: number, flagAssetId: string) => {
    mainCovenantScript: string[];
    controlBlock: string;
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
};
export declare const bodyCalculaterNV2: (n: number, flagAssetId: string, pair1Coefficient?: number) => string;
export declare const createCovenantsV2: (leafCount: number, lookupLeafIndex: number, flagAssetId: string, pair1Coefficient?: number | undefined) => {
    mainCovenantScript: string[];
    controlBlock: string;
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
};
