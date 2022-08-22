export declare const createCommitmentOutput: (flagAssetId: string, pubkey: string) => string;
export declare const commitmentOutputTapscript: (flagAssetId: string, pubkey: string) => {
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
    commitmentOutput: string;
    controlBlock: string;
};
