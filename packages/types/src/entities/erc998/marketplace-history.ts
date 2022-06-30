import { IIdDateBase } from "@gemunion/types-collection";

import { IToken } from "../hierarchy/token";

export enum Erc998MarketplaceEventType {
  Redeem = "Redeem",
  RedeemDropbox = "RedeemDropbox",
}

export interface IErc998MarketplaceRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

export type TErc998MarketplaceEventData = IErc998MarketplaceRedeem;

export interface IErc998MarketplaceHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc998MarketplaceEventType;
  eventData: TErc998MarketplaceEventData;
  tokenId: number | null;
  token?: IToken;
}
