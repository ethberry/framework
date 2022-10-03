import type { ILotteryRound, ILotteryTicket } from "@framework/types";

export const getNumbers = ({ numbers }: ILotteryRound | ILotteryTicket): string => {
  return numbers
    ? numbers
        .reduce((memo, current, i) => {
          if (current) {
            memo.push(i + 1);
          }
          return memo;
        }, [] as Array<number>)
        .join(", ")
    : "";
};

export const getWinners = (ticket: ILotteryTicket, round: ILotteryRound) => {
  const tN = getNumbers(ticket).split(", ");
  const rN = getNumbers(round).split(", ");
  const count = rN.filter(i => tN.includes(i)).length;
  return count ? `winner ${count} of 6` : "";
};
