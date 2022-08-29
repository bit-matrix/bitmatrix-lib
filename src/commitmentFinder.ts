import { TxDetail } from "@bitmatrix/esplora-api-client";
import { CTXFinderResult, Pool, TxDetailRPC, TxVInRPC, TxVOutRPC } from "@bitmatrix/models";
import sha256Streaming from "@bitmatrix/sha256streaming";
import { convertion } from "@script-wiz/lib-core";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import { api, commitmentOutput } from ".";
import { lbtcAssest, replaceChar } from "./utils/helper";

export const commitmentFinder = async (transaction: TxDetail, pools: Pool[]): Promise<CTXFinderResult | undefined> => {
  // fetch tx details with rpc
  console.log("DENEME TEST");
  const rawTransactionHex: string = await api.getRawTransaction(transaction.txid);
  const decodedTransaction: TxDetailRPC = await api.decodeRawTransaction(rawTransactionHex);
  //tx outputs
  const outputs: TxVOutRPC[] = decodedTransaction.vout;

  const inputs: TxVInRPC[] = decodedTransaction.vin;
  const outputCount: WizData = WizData.fromNumber(outputs.length);
  // OP Return check
  const opReturnOutput: Array<string> = outputs[outputs.length - 1].scriptPubKey.asm.split(" ");
  if (opReturnOutput[0] !== "OP_RETURN") return undefined;

  if (decodedTransaction.locktime !== 0) return undefined;

  const locktimeHex: string = convertion.numToLE32(WizData.fromNumber(decodedTransaction.locktime)).hex;

  const callData: string = opReturnOutput[1];

  if (callData.length !== 156) return undefined;

  //poolIdLE (64)
  const poolId: string = hexLE(callData.substring(0, 64));

  const pool = pools.find((p) => {
    return p.id === poolId && p.active;
  });

  if (!pool) return undefined;

  //methodCall (2)
  const methodCall: string = callData.substring(64, 66);

  // public key (66)
  const publicKey: string = callData.substring(66, 132);

  // slippageTolerance / amount (16)
  const slippageTolerance: string = callData.substring(132, 148);

  //orderingFees (8)
  const orderingFee: string = callData.substring(148, 156);

  const cmtOutput1 = outputs[0];
  const cmtOutput2 = outputs[1];

  let cmtOutput3;

  if (methodCall === "03") {
    cmtOutput3 = outputs[2];
  }

  if (cmtOutput1.asset !== lbtcAssest) return undefined;

  const baseTransaction = rawTransactionHex.split(callData)[0] + callData + locktimeHex;

  const replacedBaseTransaction = replaceChar(baseTransaction, 9, "0");

  const contextInput = replacedBaseTransaction.slice(0, -8);

  // sha256 initializeye sok
  // 40 byte - 103 byte arası limit validasyon
  const sha256InitializeResult: string = (sha256Streaming.sha256Initializer(contextInput) as string).toLowerCase();
  const sha256InitializeResultLength = sha256InitializeResult.length;

  if (sha256InitializeResultLength <= 80 && sha256InitializeResultLength >= 206) return undefined;

  // PART - 1
  const part1 = sha256InitializeResult.substring(0, 80);

  // Part - 2
  const part2 = sha256InitializeResult.substring(80);

  // Part - 3
  const part3 = callData.substring(0, 156 - part2.length);

  const commitmentOutputResult = commitmentOutput.commitmentOutputTapscript(poolId, publicKey);
  const tapTweakedResult = commitmentOutputResult.taprootResult.tweak.hex;
  const tweakKeyPrefix = tapTweakedResult.substring(0, 2);

  return {
    tweakKeyPrefix,
    part1,
    part2,
    part3,
    locktimeHex,
    outputCount,
    inputs,
    outputs,
    poolId,
    methodCall,
    publicKey,
    slippageTolerance,
    orderingFee,
    cmtOutput1,
    cmtOutput2,
    cmtOutput3,
    transaction,
  };
};
