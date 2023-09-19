import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../../exchange/asset";
import { ILotteryRound } from "./round";

export interface ILotteryRoundAggregation extends IIdDateBase {
  roundId: number;
  round: ILotteryRound;
  match: number; // 1-6
  tickets: number;
  priceId: number;
  price?: IAsset;
}
