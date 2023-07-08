import { CronExpression, ILotteryRound, IRaffleRound } from "@framework/types";
import { emptyContract } from "./empty-contract";

export const emptyLotteryRound = { id: 1, maxTickets: 0 } as ILotteryRound;

export const emptyRaffleRound = { id: 1, maxTickets: 0 } as IRaffleRound;

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
