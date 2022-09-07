import type { IIdDateBase } from "@gemunion/types-collection";

import { ITemplate } from "./template";
import { IBalance } from "./balance";
import { IOwnership } from "./ownership";
import { IAssetComponentHistory } from "../mechanics/asset-component-history";

export enum TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export enum TokenAttributes {
  TEMPLATE_ID = "TEMPLATE_ID",
  GRADE = "GRADE",
  RARITY = "RARITY",
  GENES = "GENES",
}

export enum TokenGenes {
  STRENGTH = "STRENGTH",
  DEXTERITY = "DEXTERITY",
  CONSTITUTION = "CONSTITUTION",
  INTELLIGENCE = "INTELLIGENCE",
  WISDOM = "WISDOM",
  CHARISMA = "CHARISMA",
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
  history?: IAssetComponentHistory;
}
