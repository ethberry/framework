import { IContract } from "@gemunion/types-collection";

import { IErc20TokenHistory } from "./token-history";
import { IErc20Token } from "./token";

export enum Erc20VestingType {
  FLAT = "FLAT",
}

export interface IErc20Vesting extends IContract {
  token: string;
  amount: string;
  beneficiary: string;
  duration: number;
  startTimestamp: string;
  vestingType: Erc20VestingType;
  history?: Array<IErc20TokenHistory>;
  erc20TokenId: number;
  erc20Token?: IErc20Token;
}
