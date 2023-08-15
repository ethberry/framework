import { IRaffleRound } from "@framework/types";

export interface IRaffleRoundStatistic {
  round: IRaffleRound;
  matches: Array<{
    winners: number;
  }>;
}
