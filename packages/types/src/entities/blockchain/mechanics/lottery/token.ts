import type { IToken } from "../../hierarchy/token";
import type { ILotteryRound } from "./round";

export interface ILotteryToken extends IToken {
  round: Partial<ILotteryRound>;
}
