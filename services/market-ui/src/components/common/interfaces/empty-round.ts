import { CronExpression, ILotteryRound } from "@framework/types";
import { emptyContract } from "./empty-contract";

export const emptyRound = { id: 1, maxTickets: 0 } as ILotteryRound;

export const emptyLottery = Object.assign(emptyContract, {
  parameters: { schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT },
  round: emptyRound,
});
