/// <reference types="node" />
import { confidential, UnblindedOutput } from "ldk";
export declare function inputBlindingDataMap(pset: string, utxos: UnblindedOutput[]): Map<number, confidential.UnblindOutputResult>;
export declare function outPubKeysMap(pset: string, outputAddresses: string[]): Map<number, Buffer>;
