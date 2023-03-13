import type { IIdDateBase } from "@gemunion/types-collection";

import type { ITemplate } from "./template";
import type { IBalance } from "./balance";
import type { IOwnership } from "./ownership";
import type { IAssetComponentHistory } from "../exchange/asset-component-history";
import type { IEventHistory } from "../event-history";

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
  imageUrl: string | null;
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
  exchange?: Array<IAssetComponentHistory>;
  history?: Array<IEventHistory>;
}
