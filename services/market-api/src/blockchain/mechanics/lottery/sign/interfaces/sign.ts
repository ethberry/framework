export interface ISignLotteryDto {
  roundId: number;
  account: string;
  referrer: string;
  ticketNumbers: Array<boolean>;
}
