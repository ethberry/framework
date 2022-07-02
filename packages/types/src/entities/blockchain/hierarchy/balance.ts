import { IIdDateBase } from "@gemunion/types-collection";

import { IToken } from "./token";

export interface IBalance extends IIdDateBase {
  account: string;
  amount: string;
  tokenId: number;
  token?: IToken;
}
