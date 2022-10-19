import { ILotteryRound, ILotteryTicket } from "@framework/types";

export const getNumbers = ({ numbers }: ILotteryTicket | ILotteryRound): string => {
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

export const getSelectedNumbers = (ticketNumbers: boolean[]): number[] =>
  ticketNumbers.reduceRight((acc: number[], cell: boolean, i: number) => {
    cell && acc.push(i + 1);
    return acc;
  }, []);

export const getDefaultTickets = (): boolean[] => new Array(36).fill(false) as boolean[];
