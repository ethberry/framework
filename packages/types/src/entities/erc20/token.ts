import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc20TokenHistory } from "./token-history";

export enum Erc20TokenStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum Erc20TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBCS
  "BLACKLIST" = "BLACKLIST", // ACBCS + BLACKLIST
}

export interface IErc20Token extends IContract, ISearchable {
  symbol: string;
  amount: string;
  address: string;
  tokenStatus: Erc20TokenStatus;
  contractTemplate: Erc20TokenTemplate;
  history?: Array<IErc20TokenHistory>;
}
