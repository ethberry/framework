import { IIdDateBase } from "@gemunion/types-collection";
import { IAsset } from "./asset";

export enum MarketplaceEventType {
  RedeemCommon = "RedeemCommon",
  RedeemLootbox = "RedeemLootbox",
}

export interface IMarketplaceRedeemCommon {
  from: string;
  item: IAsset;
  price: IAsset;
}

export interface IMarketplaceRedeemLootbox {
  from: string;
  item: IAsset;
  price: IAsset;
}

export type TMarketplaceEventData = IMarketplaceRedeemCommon | IMarketplaceRedeemLootbox;

export interface IMarketplaceHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: MarketplaceEventType;
  eventData: TMarketplaceEventData;
}
