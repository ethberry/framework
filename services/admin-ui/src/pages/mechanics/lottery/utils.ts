import type { ILotteryRound, ILotteryTicket } from "@framework/types";

export const getNumbers = ({ numbers }: ILotteryRound | ILotteryTicket) => {
  return numbers
    .reduce((memo, current, i) => {
      if (current) {
        memo.push(i + 1);
      }
      return memo;
    }, [] as Array<number>)
    .join(", ");
};
