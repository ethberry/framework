import type { IIdDateBase } from "@gemunion/types-collection";

import type { IToken } from "./token";

export interface IBalance extends IIdDateBase {
  account: string;
  amount: string;
  tokenId: number;
  token?: IToken;
  targetId: number | null;
  target?: IToken;
}
