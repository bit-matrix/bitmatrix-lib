export declare const bodyCalculaterN: (n: number, flagAssetId: string, pair1Coefficient?: number) => string;
export declare const createCovenants: (leafCount: number, lookupLeafIndex: number, flagAssetId: string, pair1Coefficient?: number) => {
    mainCovenantScript: string[];
    controlBlock: string;
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
};
