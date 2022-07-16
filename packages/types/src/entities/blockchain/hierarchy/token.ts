import { IIdDateBase } from "@gemunion/types-collection";

import { ITemplate } from "./template";
import { IBalance } from "./balance";

export enum TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export enum TokenAttributes {
  TEMPLATE_ID = "TEMPLATE_ID",
  GRADE = "GRADE",
  RARITY = "RARITY",
}

export interface IToken extends IIdDateBase {
  attributes: any;
  tokenId: string;
  royalty: number;
  tokenStatus: TokenStatus;
  templateId: number | null;
  template?: ITemplate;
  balance?: Array<IBalance>;
}
