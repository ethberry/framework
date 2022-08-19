import { ILotteryTicket } from "@framework/types";

export const getNumbers = ({ numbers }: ILotteryTicket) => {
  return numbers
    .reduce((memo, current, i) => {
      if (current) {
        memo.push(i);
      }
      return memo;
    }, [] as Array<number>)
    .join(", ");
};
