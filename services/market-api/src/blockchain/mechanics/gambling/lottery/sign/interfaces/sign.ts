export interface ILotterySignDto {
  contractId: number;
  referrer: string;
  ticketNumbers: string;
  chainId?: number;
  account?: string;
}
