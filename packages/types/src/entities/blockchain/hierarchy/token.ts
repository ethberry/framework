import type { IIdDateBase } from "@gemunion/types-collection";

import { ITemplate } from "./template";
import { IBalance } from "./balance";
import { IOwnership } from "./ownership";

export enum TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export enum TokenAttributes {
  TEMPLATE_ID = "template_id",
  GRADE = "grade",
  RARITY = "rarity",
}

export interface IToken extends IIdDateBase {
  attributes: any;
  tokenId: string;
  royalty: number;
  cid: string | null;
  tokenStatus: TokenStatus;
  templateId: number | null;
  template?: ITemplate;
  balance?: Array<IBalance>;
  parent?: Array<IOwnership>;
  children?: Array<IOwnership>;
}
