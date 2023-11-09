import type { IContract, IToken } from "@framework/types";

export interface IStakingBalancePayload {
  contract: IContract;
  token: IToken;
  balance: string;
  deposit: string;
}
