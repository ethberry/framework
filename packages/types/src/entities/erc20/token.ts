import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc20TokenHistory } from "./token-history";

export enum Erc20TokenStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc20Token extends IContract, ISearchable {
  symbol: string;
  amount: string;
  tokenStatus: Erc20TokenStatus;
  history?: Array<IErc20TokenHistory>;
}
