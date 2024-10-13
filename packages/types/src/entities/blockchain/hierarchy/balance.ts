import type { IIdDateBase } from "@ethberry/types-collection";

import type { IToken } from "./token";

export interface IBalance extends IIdDateBase {
  account: string;
  amount: bigint;
  tokenId: number;
  token?: IToken;
  targetId: number | null;
  target?: IToken;
}
