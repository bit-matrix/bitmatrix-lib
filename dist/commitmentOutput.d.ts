export declare const createCommitmentOutput: (flagAssetId: string, pubkey: string, isAddLiquidity?: boolean) => string;
export declare const commitmentOutputTapscript: (flagAssetId: string, pubkey: string, isAddLiquidity?: boolean | undefined) => {
    taprootResult: import("@script-wiz/lib-core/taproot/model").Taproot;
    commitmentOutput: string;
    controlBlock: string;
};
