import { IIdBase } from "@gemunion/types-collection";

export enum Erc1155MarketplaceEventType {
  Redeem = "Redeem",
}

export interface IErc1155MarketplaceRedeem {
  from: string;
  collection: string;
  tokenIds: Array<string>;
  amounts: Array<string>;
  price: string;
}

export interface IErc1155MarketplaceRedeemSingle {
  from: string;
  collection: string;
  tokenId: string;
  amount: string;
  price: string;
}

export type TErc1155MarketplaceEventData = IErc1155MarketplaceRedeem;

export interface IErc1155MarketplaceHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc1155MarketplaceEventType;
  eventData: TErc1155MarketplaceEventData | IErc1155MarketplaceRedeemSingle;
}
