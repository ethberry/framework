import type { IMerchant, IRaffleRound, IToken } from "@framework/types";

export interface IRafflePrizePayload {
  merchant: IMerchant;
  token: IToken;
  round: IRaffleRound;
}
