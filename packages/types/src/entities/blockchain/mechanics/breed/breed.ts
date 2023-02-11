import type { IIdDateBase } from "@gemunion/types-collection";

import { IToken } from "../../hierarchy/token";
import { IEventHistory } from "../../event-history";

export interface IBreed extends IIdDateBase {
  genes: string;
  count: number;
  tokenId: number;
  token: IToken;
  children?: Array<IEventHistory>;
  matrons?: Array<IEventHistory>;
  sires?: Array<IEventHistory>;
}
