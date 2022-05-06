import { IIdBase } from "@gemunion/types-collection";

import { IErc20TokenHistory } from "./token-history";

export enum Erc20TokenStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc20Token extends IIdBase {
  title: string;
  description: string;
  symbol: string;
  amount: string;
  tokenStatus: Erc20TokenStatus;
  history?: Array<IErc20TokenHistory>;
}
