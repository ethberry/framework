import { IIdDateBase } from "@gemunion/types-collection";

import { IUniToken } from "./uni-token";

export interface IUniBalance extends IIdDateBase {
  account: string;
  amount: string;
  uniTokenId: number;
  uniToken?: IUniToken;
}
