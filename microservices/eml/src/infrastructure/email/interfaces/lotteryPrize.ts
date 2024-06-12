import type { ILotteryRound, IMerchant, IToken } from "@framework/types";

export interface ILotteryPrizePayload {
  merchant: IMerchant;
  token: IToken;
  round: ILotteryRound;
}
