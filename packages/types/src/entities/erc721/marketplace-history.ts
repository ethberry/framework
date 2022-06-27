import { IIdDateBase } from "@gemunion/types-collection";

import { IUniToken } from "../uni-token/uni-token";

export enum Erc721MarketplaceEventType {
  Redeem = "Redeem",
  RedeemDropbox = "RedeemDropbox",
}

export interface IErc721MarketplaceRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

export type TErc721MarketplaceEventData = IErc721MarketplaceRedeem;

export interface IErc721MarketplaceHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc721MarketplaceEventType;
  eventData: TErc721MarketplaceEventData;
  uniTokenId: number | null;
  uniToken?: IUniToken;
}
