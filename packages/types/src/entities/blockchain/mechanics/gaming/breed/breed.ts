import type { IIdDateBase } from "@ethberry/types-collection";

import type { IToken } from "../../../hierarchy/token";
import type { IEventHistory } from "../../../event-history";

export interface IBreed extends IIdDateBase {
  traits: string;
  count: number;
  tokenId: number;
  token: IToken;
  children?: Array<IEventHistory>;
  matrons?: Array<IEventHistory>;
  sires?: Array<IEventHistory>;
}
