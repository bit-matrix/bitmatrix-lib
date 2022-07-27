import { TxDetail } from "@bitmatrix/esplora-api-client";
import { CTXFinderResult, Pool } from "@bitmatrix/models";
export declare const commitmentFinder: (transaction: TxDetail, pools: Pool[]) => Promise<CTXFinderResult | undefined>;
