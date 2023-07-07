import { IRaffleRound, IToken, IUser } from "@framework/types";

export interface IPrizeRaffleData {
  account: IUser;
  round: IRaffleRound;
  ticket: IToken;
  multiplier: string;
}
