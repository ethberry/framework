import type { IIdDateBase } from "@gemunion/types-collection";

import type { ITemplate } from "./template";
import type { IBalance } from "./balance";
import type { IAssetComponentHistory } from "../exchange/asset-component-history";
import type { IEventHistory } from "../event-history";

export enum TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export enum TokenMetadata {
  TEMPLATE_ID = "TEMPLATE_ID",
  LEVEL = "LEVEL",
  GRADE = "GRADE",
  RARITY = "RARITY",
  TRAITS = "TRAITS",
  GENES = "GENES",
  ROUND = "ROUND",
  NUMBERS = "NUMBERS",
  PRIZE = "PRIZE",
}

export enum TokenGenes {
  STRENGTH = "STRENGTH",
  DEXTERITY = "DEXTERITY",
  CONSTITUTION = "CONSTITUTION",
  INTELLIGENCE = "INTELLIGENCE",
  WISDOM = "WISDOM",
  CHARISMA = "CHARISMA",
}

export enum TokenTraits {
  CLOTHES = "CLOTHES",
  EYES = "EYES",
  MOUTH = "MOUTH",
}

export interface IToken extends IIdDateBase {
  imageUrl: string | null;
  metadata: any;
  tokenId: string;
  royalty: number;
  cid: string | null;
  tokenStatus: TokenStatus;
  templateId: number | null;
  template?: ITemplate;
  balance?: Array<IBalance>;
  exchange?: Array<IAssetComponentHistory>;
  history?: Array<IEventHistory>;
}
