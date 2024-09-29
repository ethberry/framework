import type { IIdDateBase } from "@ethberry/types-collection";

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
  RARITY = "RARITY",
  TRAITS = "TRAITS",
  GENES = "GENES",
  ROUND = "ROUND",
  NUMBERS = "NUMBERS",
  PRIZE = "PRIZE",
}

export enum TokenTraits {
  CLOTHES = "CLOTHES",
  EYES = "EYES",
  MOUTH = "MOUTH",
}

export enum ProtectedAttribute {
  TEMPLATE_ID = "TEMPLATE_ID",
  RARITY = "RARITY",
  TRAITS = "TRAITS",
  GENES = "GENES",
}

export interface IToken extends IIdDateBase {
  imageUrl: string | null;
  metadata: any;
  tokenId: string;
  royalty: number;
  cid: string | null;
  tokenStatus: TokenStatus;
  templateId: number;
  template?: ITemplate;
  balance?: Array<IBalance>;
  exchange?: Array<IAssetComponentHistory>;
  history?: Array<IEventHistory>;
}
