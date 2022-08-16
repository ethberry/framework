import { ILotteryRound } from "@framework/types";

export const getNumbers = ({ numbers }: ILotteryRound) => {
  return numbers
    .reduce((memo, current, i) => {
      if (current) {
        memo.push(i);
      }
      return memo;
    }, [] as Array<number>)
    .join(", ");
};
