import { ILotteryRound } from "@framework/types";

export interface ILotteryRoundStatistic {
  round: ILotteryRound;
  matches: Array<{
    winners: number;
  }>;
}
