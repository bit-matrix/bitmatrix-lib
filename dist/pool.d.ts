export declare const bodyCalculaterN: (n: number, flagAssetId: string) => string;
export declare const createCovenants: (leafCount: number, lookupLeafIndex: number, flagAssetId: string) => {
    mainCovenantScript: string[];
    controlBlock: string;
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
};
