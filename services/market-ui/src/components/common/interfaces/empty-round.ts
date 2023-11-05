import { CronExpression, ILotteryRound, IRaffleRound, IToken } from "@framework/types";
import { emptyContract } from "./empty-contract";

export interface IRaffleRoundStatistic extends IRaffleRound {
  prizeTicket: IToken | null;
  ticketCount: number;
}

export const emptyLotteryRound = { id: 1, maxTickets: 0 } as ILotteryRound;

export const emptyRaffleRound = { id: 1, maxTickets: 0, prizeTicket: null } as IRaffleRoundStatistic;

export const emptyLottery = Object.assign(emptyContract, {
  parameters: { schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT },
  round: emptyLotteryRound,
  count: 0,
});

export const emptyRaffle = Object.assign(emptyContract, {
  parameters: { schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT },
  round: emptyRaffleRound,
  count: 0,
});
